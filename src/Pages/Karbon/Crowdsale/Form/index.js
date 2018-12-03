import React from 'react'
import * as yup from 'yup'
import moment from 'moment'
import { Formik } from 'formik'
import PropTypes from 'prop-types'
import { Button } from '@react-core/button'
import { Checkbox } from '@react-core/checkbox'
import { toast } from '@react-core/toast'
import { theme } from '@react-core/theme-karbon'
import { TextField } from '@react-core/textfield'
import style from './style.scss'

const validationSchema = getTranslation => {
  return yup.object().shape({
    amount: yup
      .number()
      .min('0.01', getTranslation('intro.invalidValue'))
      .typeError(getTranslation('intro.invalidValue'))
      .required(getTranslation('intro.enterAmount'))
  })
}

const onBuy = async ({
  values,
  api,
  getTranslation,
  buyTokens,
  updateUI,
  web3,
  accounts
}) => {
  await buyTokens(
    accounts.addresses[0],
    { from: accounts.addresses[0], value: web3.toWei(values.amount, 'ether') },
    (err, res) => {
      if (err) {
        toast.error(getTranslation('intro.buyError'), {
          position: toast.POSITION.BOTTOM_LEFT
        })
      }

      if (res) {
        api.resetForm()
        toast.warning(getTranslation('intro.buyConfirmation'), {
          position: toast.POSITION.BOTTOM_LEFT
        })

        web3.eth.getTransactionReceiptMined(res).then(txReceipt => {
          // Mining is finished
          // const { blockNumber, transactionHash, gasUsed } = txReceipt
          updateUI(txReceipt)
          toast.success(getTranslation('intro.buyOK'), {
            position: toast.POSITION.BOTTOM_LEFT
          })
        })
      }
    }
  )
}

const Form = ({
  from,
  to,
  balance = 0,
  rate = 0,
  ticker = '',
  capReached,
  getTranslation,
  amountToLocale,
  buyTokens,
  updateUI,
  web3 = { toWei: new Function() },
  accounts
}) => (
  <div className="form">
    <div className="balance">
      <h3>{`${web3.version ? balance : ''} ${ticker}`}</h3>
      <p>{getTranslation('intro.balance')}</p>

      <p className="info">{getTranslation('intro.balanceInfo')}</p>
    </div>

    <div className="contribute">
      <Formik
        validateOnChange
        validateOnSubmit
        onSubmit={(values, api) =>
          onBuy({
            values,
            api,
            getTranslation,
            buyTokens,
            updateUI,
            web3,
            accounts
          })
        }
        enableReinitialize
        initialValues={{ amount: 1, discalimer: true }}
        validationSchema={() => validationSchema(getTranslation)}
        render={api => {
          const now = moment.utc()
          const hasStarted =
            from &&
            moment
              .unix(from)
              .utc()
              .diff(now) < 0
          const hasEnded =
            to &&
            moment
              .unix(to)
              .utc()
              .diff(now) < 0

          const datesLoaded = hasStarted !== undefined && hasEnded !== undefined
          const crowdsaleOpen = hasStarted && !hasEnded && !capReached
          const disabled = !web3.version || !datesLoaded || !crowdsaleOpen

          return (
            <form onSubmit={api.handleSubmit}>
              <TextField
                theme={theme}
                name="amount"
                step="0.25"
                min="0.01"
                type="number"
                autoComplete="off"
                onKeyUp={new Function()}
                onChange={api.handleChange}
                onBlur={api.handleBlur}
                placeholder={api.errors.amount}
                value={disabled ? '' : api.values.amount}
                label={getTranslation('intro.contributionAmount')}
                data-invalid={api.touched.amount && !!api.errors.amount}
                disabled={!web3.version || disabled}
              />

              <Checkbox
                theme={theme}
                name="discalimer"
                onChange={api.handleChange}
                onBlur={api.handleBlur}
                value={api.values.discalimer}
                label={getTranslation('intro.USAContributionDisclaimer')}
                disabled={!web3.version || disabled}
              />

              <p className="convertion">{`${
                disabled ? 0 : api.values.amount
              } Eth = ${amountToLocale(
                disabled ? 0 : api.values.amount * Number(rate)
              )} K14`}</p>

              <Button
                theme={theme}
                type="button"
                label={getTranslation('intro.contribution')}
                onClick={api.submitForm}
                disabled={!api.values.discalimer || disabled}
              />
            </form>
          )
        }}
      />
      <p className="info">{getTranslation('intro.thinkTwice', true)}</p>
    </div>
    <style jsx>{style}</style>
  </div>
)

Form.propTypes = {
  from: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ticker: PropTypes.string,
  capReached: PropTypes.bool,
  getTranslation: PropTypes.func,
  amountToLocale: PropTypes.func,
  buyTokens: PropTypes.func,
  updateUI: PropTypes.func,
  web3: PropTypes.object,
  accounts: PropTypes.object
}

export { Form }
