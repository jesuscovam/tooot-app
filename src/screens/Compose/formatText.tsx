import LinkifyIt from 'linkify-it'
import { debounce, differenceWith, isEqual } from 'lodash'
import React, { Dispatch } from 'react'
import { FetchOptions } from 'react-query/types/core/query'
import { useTheme } from '@utils/styles/ThemeManager'
import { ComposeAction, ComposeState } from './utils/types'
import { instanceConfigurationStatusCharsURL } from './Root'
import CustomText from '@components/Text'
import { emojis } from '@components/Emojis'

export interface Params {
  textInput: ComposeState['textInputFocus']['current']
  composeDispatch: Dispatch<ComposeAction>
  content: string
  refetch?: (options?: FetchOptions | undefined) => Promise<any>
  disableDebounce?: boolean
}

const TagText = ({ text }: { text: string }) => {
  const { colors } = useTheme()

  return <CustomText style={{ color: colors.blue }}>{text}</CustomText>
}

const linkify = new LinkifyIt()
linkify
  .set({ fuzzyLink: false, fuzzyEmail: false })
  .add('@', {
    validate: function (text, pos, self) {
      var tail = text.slice(pos)

      if (!self.re.mention) {
        self.re.mention = new RegExp('^\\S+')
      }
      if (self.re.mention.test(tail)) {
        return tail.match(self.re.mention)![0].length
      }
      return 0
    }
  })
  .add('#', {
    validate: function (text, pos, self) {
      var tail = text.slice(pos)

      if (!self.re.hashtag) {
        self.re.hashtag = new RegExp('^[A-Za-z0-9_]+')
      }
      if (self.re.hashtag.test(tail)) {
        return tail.match(self.re.hashtag)![0].length
      }
      return 0
    }
  })
  .add(':', {
    validate: function (text, pos, self) {
      var tail = text.slice(pos)

      if (!self.re.emoji) {
        self.re.emoji = new RegExp('^(?:([^:]+):)')
      }
      if (self.re.emoji.test(tail)) {
        return tail.match(self.re.emoji)![0].length
      }
      return 0
    }
  })

const debouncedSuggestions = debounce(
  (composeDispatch, tag) => {
    composeDispatch({ type: 'tag', payload: tag })
  },
  500,
  { trailing: true }
)

let prevTags: ComposeState['tag'][] = []

const formatText = ({ textInput, composeDispatch, content, disableDebounce = false }: Params) => {
  const tags = linkify.match(content)
  if (!tags) {
    composeDispatch({
      type: textInput,
      payload: {
        count: content.length,
        raw: content,
        formatted: <CustomText children={content} />
      }
    })
    return
  }

  const changedTag: LinkifyIt.Match[] = differenceWith(tags, prevTags, isEqual)
  if (changedTag.length > 0 && !disableDebounce) {
    if (changedTag[0]?.schema === '@' || changedTag[0]?.schema === '#') {
      debouncedSuggestions(composeDispatch, changedTag[0])
    }
  } else {
    debouncedSuggestions.cancel()
    composeDispatch({ type: 'tag', payload: undefined })
  }
  prevTags = tags
  let _content = content
  let pointer = 0
  let contentLength: number = 0
  const children = []
  tags.forEach((tag, index) => {
    const prev = _content.substring(0, tag.index - pointer)
    const main = _content.substring(tag.index - pointer, tag.lastIndex - pointer)
    const next = _content.substring(tag.lastIndex - pointer)
    children.push(prev)
    contentLength = contentLength + prev.length

    if (tag.schema === ':') {
      if (emojis.current?.length) {
        const matchedEmoji = emojis.current.filter(
          emojisSection =>
            emojisSection.data.filter(
              emojisGroup => emojisGroup.filter(emoji => `:${emoji.shortcode}:` === main).length
            ).length
        ).length
        if (matchedEmoji) {
          children.push(<TagText key={index} text={main} />)
        } else {
          children.push(main)
        }
      }
    } else {
      children.push(<TagText key={index} text={main} />)
    }

    switch (tag.schema) {
      case '@':
        const theMatch = main.match(/@/g)
        if (theMatch && theMatch.length > 1) {
          contentLength = contentLength + main.split(new RegExp('(@.*?)@'))[1].length
        } else {
          contentLength = contentLength + main.length
        }
        break
      case '#':
      case ':':
        contentLength = contentLength + main.length
        break
      default:
        contentLength = contentLength + instanceConfigurationStatusCharsURL
        break
    }
    _content = next
    pointer = pointer + prev.length + tag.lastIndex - tag.index
  })
  children.push(_content)
  contentLength = contentLength + _content.length

  composeDispatch({
    type: textInput,
    payload: {
      count: contentLength,
      raw: content,
      formatted: <CustomText children={children} />
    }
  })
}

export default formatText
