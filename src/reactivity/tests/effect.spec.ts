import { effect, stop } from "../effect"
import { reactive } from "../reactivity"

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10
    })
    let nextAge 
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)

    //update
    user.age++
    expect(nextAge).toBe(12)
  })

  it('should return runner when call effect', () => {
    // effect函数执行。返回一个runner函数，调用runner函数，该函数会再次执行effect内部传入的那个fn函数，然后fn会将自己的返回值return出去
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })

    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe('foo')
  })

  it('scheduler', () => {
    /**
     * 1. 通过 effect 的第二个参数给定的一个 scheduler 的 fn
     * 2. effect 第一次执行的时候会执行 fn，不会执行 scheduler
     * 3. 当响应式对象 set update 不会执行 fn, 而是执行 scheduler
     * 4. 如果说当执行 runner 的时候，会再次执行 fn
     */
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }  
    )
    expect(scheduler).not.toHaveBeenCalled() //首次不被调用
    expect(dummy).toBe(1)
    obj.foo++
    expect(scheduler).toHaveBeenCalled() // update时调用scheduler，而不是fn
    expect(dummy).toBe(1) //验证没有调用fn
    run()
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner) //stop runner 后，
    obj.prop = 3 // obj.prop 是成功的
    expect(dummy).toBe(2) //但是赋值给 dummy 是不成功的
    expect(obj.prop).toBe(3)
    /**
     * stop 会阻止effect执行，并且是永久的
     */

    runner() //但是手动调用 runner，两个值都会更新
    expect(dummy).toBe(3)
  })

  it('onStop', () => {
    const obj = reactive({
      foo: 1
    })
    const onStop = jest.fn()
    let dummy
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        onStop
      }  
    )

    stop(runner) //在 stop 时， onStop 会被调用
    expect(onStop).toBeCalledTimes(1)
  })
})

