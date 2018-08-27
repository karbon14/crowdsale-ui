import React from 'react'
import * as yup from 'yup'
import { Formik } from 'formik'
import PropTypes from 'prop-types'
import style from './style.scss'
import { Karbon } from '../../../../../styles/core'
import { Button } from '@react-core/button'
import { TextField } from '@react-core/textfield'

const onBuy = async (
  values,
  api,
  getTranslation,
  buyTokens,
  web3,
  accounts
) => {
  console.log(web3)
  try {
    await buyTokens([
      accounts.addresses[0],
      {
        value: web3.toWei(1, 'ether'),
        from: accounts.addresses[0]
      }
    ])
      .call()
      .then((e, r) => {
        console.log(e)
        console.log(r)
        // api.resetForm()
        // alert(getTranslation('intro.buyOK'))
      })
  } catch (e) {
    alert(e)
  }
}

const validationSchema = getTranslation => {
  return yup.object().shape({
    tokens: yup
      .number()
      .min('0.01', getTranslation('intro.invalidValue'))
      .typeError(getTranslation('intro.invalidValue'))
      .required(getTranslation('intro.enterAmount'))
  })
}

const Form = ({
  balance = '',
  ticker = '',
  getTranslation,
  buyTokens,
  web3,
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
        initialValues={{ tokens: 1 }}
        validationSchema={() => validationSchema(getTranslation)}
        render={api => (
          <form onSubmit={api.handleSubmit}>
            <TextField
              theme={Karbon}
              name="tokens"
              step="0.25"
              type="number"
              autoComplete="off"
              value={api.values.tokens}
              label={getTranslation('intro.investAmount')}
              placeholder={api.errors.tokens}
              onChange={api.handleChange}
              onBlur={api.handleBlur}
              data-invalid={api.touched.tokens && !!api.errors.tokens}
            />

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
  balance: PropTypes.string,
  ticker: PropTypes.string,
  getTranslation: PropTypes.func,
  buyTokens: PropTypes.func
}

export { Form }
