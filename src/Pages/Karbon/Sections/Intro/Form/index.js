import React from 'react'
import * as yup from 'yup'
import { Formik } from 'formik'
import PropTypes from 'prop-types'
import { Button } from '@react-core/button'
import { TextField } from '@react-core/textfield'
import { toast } from '../../../../../Components/Toast'
import { Karbon } from '../../../../../styles/core'
import style from './style.scss'

const toLocale = n => {
  return Number(n).toLocaleString('de-DE', {
    minimumFractionDigits: 0
  })
}

const onBuy = (values, api, getTranslation, buyTokens, web3, accounts) => {
  buyTokens(
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
        toast.success(getTranslation('intro.buyOK'), {
          position: toast.POSITION.BOTTOM_LEFT
        })
      }
    }
  )
}

const validationSchema = getTranslation => {
  return yup.object().shape({
    amount: yup
      .number()
      .min('0.01', getTranslation('intro.invalidValue'))
      .typeError(getTranslation('intro.invalidValue'))
      .required(getTranslation('intro.enterAmount'))
  })
}

const Form = ({
  balance = '',
  rate = 0,
  ticker = '',
  getTranslation,
  buyTokens,
  web3 = { toWei: new Function() },
  accounts
}) => (
  <div className="form">
    <div className="balance">
      <h3>{`${balance} ${ticker}`}</h3>
      <p>{getTranslation('intro.balance')}</p>

      <p className="info">{getTranslation('intro.balanceInfo')}</p>
    </div>

    <div className="invest">
      <Formik
        validateOnChange
        validateOnSubmit
        onSubmit={(values, api) =>
          onBuy(values, api, getTranslation, buyTokens, web3, accounts)
        }
        enableReinitialize
        initialValues={{ amount: 1 }}
        validationSchema={() => validationSchema(getTranslation)}
        render={api => (
          <form onSubmit={api.handleSubmit}>
            <TextField
              theme={Karbon}
              name="amount"
              step="0.25"
              min="0.01"
              type="number"
              autoComplete="off"
              onKeyUp={new Function()}
              onChange={api.handleChange}
              onBlur={api.handleBlur}
              placeholder={api.errors.amount}
              value={api.values.amount}
              label={getTranslation('intro.investAmount')}
              data-invalid={api.touched.amount && !!api.errors.amount}
            />

            <p>{`${api.values.amount || 0} Ether = ${toLocale(
              api.values.amount * Number(rate)
            )} K14`}</p>

            <Button
              theme={Karbon}
              type="button"
              label={getTranslation('intro.invest')}
              onClick={api.submitForm}
            />
          </form>
        )}
      />
      <p className="info">{getTranslation('intro.thinkTwice', true)}</p>
    </div>
    <style jsx>{style}</style>
  </div>
)

Form.propTypes = {
  balance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ticker: PropTypes.string,
  getTranslation: PropTypes.func,
  buyTokens: PropTypes.func,
  web3: PropTypes.object,
  accounts: PropTypes.object
}

export { Form }
