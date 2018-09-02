import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import padStart from 'lodash/padStart'
import Component from '@reactions/component'
import style from './style.scss'

let _state, _setState, _interval

const timer = () => {
  const to = moment.unix(_state.to)
  const days = to.diff(moment.now(), 'days')
  const hours = to.subtract(days, 'days').diff(moment.now(), 'hours')
  const minutes = to.subtract(hours, 'hours').diff(moment.now(), 'minutes')
  const seconds = to.subtract(minutes, 'minutes').diff(moment.now(), 'seconds')
  _state = { ..._state, days, hours, minutes, seconds }
  _setState(_state)
}

const Counter = ({ to, cap, goal, raised, total, getTranslation }) => (
  <Component
    to={to}
    initialState={{
      to,
      cap,
      goal,
      raised,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }}
    didUpdate={({ props, prevProps, state, prevState, setState }) => {
      if (!isEqual(props.to, prevProps.to)) setState({ to })

      if (!isEqual(state.to, prevState.to)) {
        _state = state
        _setState = setState
        _interval = to
        // Update and set Timer
        timer()
        setInterval(timer, 1000)
      }
    }}
    willUnmount={() => to && clearInterval(_interval)}
    render={({ state }) => {
      const goalAdvance = `${(goal * 100) / total}, 100`
      const capAdvance = `${(cap * 100) / total}, 100`

      return (
        <div className="counter">
          <div
            className="marker"
            style={{ transform: `rotate(-${(raised * 360) / total}deg)` }}
          >
            <div className="filled" />
          </div>

          <div className="circle">
            <div className="single-chart">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle total"
                  strokeDasharray="100, 100"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {total ? (
                  <path
                    className="circle hard"
                    strokeDasharray={capAdvance}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 1 0 0 31.831
                      a 15.9155 15.9155 0 1 0 0 -31.831"
                  />
                ) : null}
                {total ? (
                  <path
                    className="circle soft"
                    strokeDasharray={goalAdvance}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 1 0 0 31.831
                      a 15.9155 15.9155 0 1 0 0 -31.831"
                  />
                ) : null}
              </svg>
            </div>

            <div className="centre">
              <div className="unit">
                <span>{state.days}</span>
                <span>{getTranslation('counter.days')}</span>
              </div>

              <div className="unit">
                <span>{state.hours}</span>
                <span>{getTranslation('counter.hours')}</span>
              </div>

              <div className="unit">
                <span>{state.minutes}</span>
                <span>{getTranslation('counter.minutes')}</span>
              </div>

              <div className="unit">
                <span>{padStart(state.seconds, 2, '0')}</span>
                <span>{getTranslation('counter.seconds')}</span>
              </div>
            </div>
          </div>

          <div className="descriptions">
            <div className="info">
              <div className="colored">
                <div className="raised" />
              </div>
              <span>
                <p>{getTranslation('counter.raised')}</p>
                <p>
                  {raised ? `${raised} ${getTranslation('counter.ether')}` : ''}
                </p>
              </span>
            </div>

            <div className="info">
              <div className="colored">
                <div className="soft" />
              </div>
              <span>
                <p>{getTranslation('counter.softCap')}</p>
                <p>
                  {goal ? `${goal} ${getTranslation('counter.ether')}` : ''}
                </p>
              </span>
            </div>

            <div className="info">
              <div className="colored">
                <div className="hard" />
              </div>
              <span>
                <p>{getTranslation('counter.hardCap')}</p>
                <p>{cap ? `${cap} ${getTranslation('counter.ether')}` : ''}</p>
              </span>
            </div>

            <div className="info">
              <div className="colored">
                <div className="total" />
              </div>
              <span>
                <p>{getTranslation('counter.totalSupply')}</p>
                <p>
                  {total ? `${total} ${getTranslation('counter.ether')}` : ''}
                </p>
              </span>
            </div>
          </div>
          <style jsx>{style}</style>
        </div>
      )
    }}
  />
)

Counter.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  goal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  raised: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  getTranslation: PropTypes.func
}

export { Counter }
