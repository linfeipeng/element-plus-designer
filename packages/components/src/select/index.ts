import { connect, mapProps, h, mapReadPretty } from '@formily/vue'
import { defineComponent } from 'vue'
import { PreviewText } from '../preview-text'

import { ElSelect, ElOption } from 'element-plus'
import { transformComponent, resolveComponent } from '../__builtins__'

export type SelectProps = typeof ElSelect & {
  options?: Array<typeof ElOption>
}

const TransformElSelect = transformComponent<SelectProps>(ElSelect, {
  change: 'update:modelValue',
})

const InnerSelect = connect(
  TransformElSelect,
  mapProps({ value: 'modelValue', readOnly: 'readonly' }),
  mapReadPretty(PreviewText.Input)
)

const SelectOption = defineComponent({
  name: 'FSelect',
  props: ['options'],
  setup(customProps, { attrs, slots }) {
    return () => {
      const options = customProps.options || []
      const children =
        options.length !== 0
          ? {
              default: () =>
                options.map((option: any) => {
                  if (typeof option === 'string') {
                    return h(
                      ElOption,
                      { value: option, label: option },
                      {
                        default: () => [
                          resolveComponent(slots?.option, { option }),
                        ],
                      }
                    )
                  } else {
                    return h(
                      ElOption,
                      {
                        ...option,
                      },
                      {
                        default: () => [
                          resolveComponent(slots?.option, {
                            option,
                          }),
                        ],
                      }
                    )
                  }
                }),
            }
          : slots
      return h(
        InnerSelect,
        {
          ...attrs,
        },
        children
      )
    }
  },
})

export const Select = connect(
  SelectOption,
  mapProps({ dataSource: 'options', loading: true }),
  mapReadPretty(PreviewText.Select)
)

export default Select
