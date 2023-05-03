import { computed } from "../computed"
import { reactive } from "../reactivity"

describe('computed', () => {
  it("happy path", () => {
    const value = reactive({
      foo: 1,
    })

    const getter = computed(() => {
      return value.foo;
    })
    expect(getter.value).toBe(1)
  })

  it('should computed lazily', () => {
    const value = reactive({
      foo: 1,
    })

    const getter = jest.fn(() => {
      return value.foo
    })
    
    const cValue = computed(getter)
    // computed 懒执行，cValue.value 不被改变(注意不是不被调用)，那么computed里面的函数不会被执行
    expect(getter).not.toHaveBeenCalled()
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    cValue.value
    expect(getter).toHaveBeenCalledTimes(1) //当调用get时，值不改变，懒执行

    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})