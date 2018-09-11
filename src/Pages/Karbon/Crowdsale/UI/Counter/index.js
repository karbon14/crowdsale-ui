import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import padStart from 'lodash/padStart'
import Component from '@reactions/component'
import style from './style.scss'

let _state, _setState, _interval

const formatDatesUTC = state => {
  return {
    from: moment.unix(state.from).utc(),
    to: moment.unix(state.to).utc(),
    now: moment.utc()
  }
}

const timer = () => {
  const { from, to, now } = formatDatesUTC(_state)
  const d = from.diff(now) < 0 ? to : from
  const hasStarted = from.diff(now) < 0
  const hasEnded = to.diff(now) < 0

  const days = d.diff(now, 'days')
  const hours = d.subtract(days, 'days').diff(now, 'hours')
  const minutes = d.subtract(hours, 'hours').diff(now, 'minutes')
  const seconds = d.subtract(minutes, 'minutes').diff(now, 'seconds')

  _state = { ..._state, days, hours, minutes, seconds, hasStarted, hasEnded }
  _setState(_state)
}

const Counter = ({
  from,
  to,
  cap,
  goal,
  raised,
  total,
  capReached,
  getTranslation,
  amountToLocale,
  updateUI
}) => (
  <Component
    from={from}
    to={to}
    initialState={{
      from,
      to,
      cap,
      goal,
      raised,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      hasStarted: false,
      hasEnded: false
    }}
    didUpdate={({ props, prevProps, state, prevState, setState }) => {
      if (!isEqual(props.from, prevProps.from)) setState({ from })
      if (!isEqual(props.to, prevProps.to)) setState({ to })
      if (
        !isEqual(state.hasStarted, prevState.hasStarted) ||
        !isEqual(state.hasEnded, prevState.hasEnded)
      ) {
        updateUI()
      }

      const hasDates = state.from && state.to
      const differFrom = !isEqual(state.from, prevState.from)
      const differTo = !isEqual(state.to, prevState.to)

      if (hasDates && (differFrom || differTo)) {
        _state = state
        _setState = setState
        _interval = setInterval(timer, 1000)
        timer()
      }
    }}
    willUnmount={() => to && from && clearInterval(_interval)}
    render={({ state }) => {
      const goalAdvance = `${(goal * 100) / total}, 100`
      const capAdvance = `${(cap * 100) / total}, 100`
      const raisedAdvance = `${(raised * 100) / total}, 100`

      const displatTime = () => {
        if (_interval) {
          const { from, to } = formatDatesUTC(state)
          const d = !state.hasStarted && !state.hasEnded ? from : to
          return `${d.format('DD/MM/YYYY HH:mm')} (UTC)`
        }
      }

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
                {total ? (
                  <path
                    className="circle raised"
                    strokeDasharray={raisedAdvance}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 1 0 0 31.831
                      a 15.9155 15.9155 0 1 0 0 -31.831"
                  />
                ) : null}
              </svg>
            </div>

            <div className="centre">
              {(_interval &&
                state.hasStarted &&
                !state.hasEnded &&
                !capReached) ||
              (_interval && !state.hasEnded && !capReached) ? (
                <React.Fragment>
                  <h3>
                    {getTranslation(
                      `counter.${state.hasStarted ? 'icoEnds' : 'icoStarts'}`
                    )}
                  </h3>
                  <h3>{displatTime()}</h3>

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
                </React.Fragment>
              ) : null}

              {state.hasEnded && !capReached ? (
                <h1 className="crowdsaleEnded">
                  {getTranslation('counter.crowdsaleEnded')}
                </h1>
              ) : null}

              {capReached ? (
                <h1 className="capReached">
                  {getTranslation('counter.capReached')}
                </h1>
              ) : null}
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
                  {raised
                    ? `${amountToLocale(raised)} ${getTranslation(
                        'counter.ether'
                      )}`
                    : ''}
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
                  {goal
                    ? `${amountToLocale(goal)} ${getTranslation(
                        'counter.ether'
                      )}`
                    : ''}
                </p>
              </span>
            </div>

            <div className="info">
              <div className="colored">
                <div className="hard" />
              </div>
              <span>
                <p>{getTranslation('counter.hardCap')}</p>
                <p>
                  {cap
                    ? `${amountToLocale(cap)} ${getTranslation(
                        'counter.ether'
                      )}`
                    : ''}
                </p>
              </span>
            </div>

            <div className="info">
              <div className="colored">
                <div className="total" />
              </div>
              <span>
                <p>{getTranslation('counter.totalSupply')}</p>
                <p>
                  {total
                    ? `${amountToLocale(total)} ${getTranslation(
                        'counter.ether'
                      )}`
                    : ''}
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
  from: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  goal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  raised: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  capReached: PropTypes.bool,
  getTranslation: PropTypes.func,
  amountToLocale: PropTypes.func,
  updateUI: PropTypes.func
}

export { Counter }
