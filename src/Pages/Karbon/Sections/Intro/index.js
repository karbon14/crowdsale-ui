import React from 'react'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import Component from '@reactions/component'
import { Info } from './UI'
import style from './style.scss'
import { Form } from './Form'
import './Assets/overlay.png'

import { EthereumProvider } from './Utils/EthereumProvider'
import CrowdsaleABI from './ABIs/Crowdsale-ABI.json'
import Karbon14TokenABI from './ABIs/Karbon14Token-ABI.json'

const toLocale = n =>
  Number(n).toLocaleString('de-DE', { minimumFractionDigits: 0 })

const updateUI = async ({ deployedContracts, accounts, setState, web3 }) => {
  const { Karbon14Token, Karbon14Crowdsale } = deployedContracts

  await Karbon14Crowdsale.getTokenTotalSupply((err, res) => {
    res &&
      setState({ totalSupply: toLocale(web3.fromWei(res.toNumber(), 'ether')) })
  })

  await Karbon14Crowdsale.rate((err, res) => {
    res && setState({ rate: res.toNumber() })
  })

  await Karbon14Token.name((err, res) => {
    res && setState({ name: res })
  })

  await Karbon14Token.symbol((err, res) => {
    res && setState({ ticker: res })
  })

  await Karbon14Token.balanceOf(accounts.addresses[0], (err, res) => {
    res &&
      setState({ balanceOf: toLocale(web3.fromWei(res.toNumber(), 'ether')) })
  })
}

const Intro = ({ getTranslation }) => (
  <EthereumProvider
    contracts={[
      {
        name: 'Karbon14Crowdsale',
        ABI: CrowdsaleABI,
        address: process.env.CROWDSALE_ADDRESS
      },
      {
        name: 'Karbon14Token',
        ABI: Karbon14TokenABI,
        address: process.env.TOKEN_ADDRESS
      }
    ]}
  >
    {({ accounts = {}, deployedContracts = {}, web3 }) => {
      const { Karbon14Crowdsale = {}, Karbon14Token = {} } = deployedContracts
      return (
        <Component
          initialState={{
            totalSupply: undefined,
            rate: undefined,
            name: undefined,
            ticker: undefined,
            balanceOf: undefined
          }}
          deployedContracts={deployedContracts}
          didUpdate={({ props, prevProps, setState }) => {
            if (
              !isEqual(props.deployedContracts, prevProps.deployedContracts)
            ) {
              updateUI({ deployedContracts, accounts, setState, web3 })
            }
          }}
          render={({ state }) => (
            <div className="intro">
              <div className="container">
                <div className="card-content">
                  <div className="left-container">
                    <div className="token">
                      <div className="counter">
                        <div className="circle">
                          <div className="centre" />
                        </div>
                      </div>

                      <div className="contracts">
                        <div className="contract-info">
                          <Info
                            value={accounts ? accounts.addresses[0] : ''}
                            label={getTranslation('intro.currentAccount')}
                            isLink={true}
                          />
                          <Info
                            value={Karbon14Token.address}
                            label={getTranslation('intro.tokenAddress')}
                            isLink={true}
                          />
                          <Info
                            value={Karbon14Crowdsale.address}
                            label={getTranslation('intro.crowdsaleAddress')}
                            isLink={true}
                          />

                          <div className="double">
                            <Info
                              value={state.name}
                              label={getTranslation('intro.name')}
                              className="double"
                            />
                            <Info
                              value={state.ticker}
                              label={getTranslation('intro.ticker')}
                              className="double"
                            />
                          </div>

                          <Info
                            value={
                              state.totalSupply && state.ticker
                                ? `${state.totalSupply} ${state.ticker}`
                                : ''
                            }
                            label={getTranslation('intro.supply')}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="info">
                      <h3>{getTranslation('intro.title')}</h3>
                      <p>{getTranslation('intro.subtitle')}</p>
                    </div>
                  </div>

                  <div className="right-container">
                    <Form
                      balance={state.balanceOf}
                      rate={state.rate}
                      ticker={state.ticker}
                      getTranslation={getTranslation}
                      buyTokens={Karbon14Crowdsale.buyTokens}
                      web3={web3}
                      accounts={accounts}
                    />
                  </div>
                </div>
              </div>
              <style jsx>{style}</style>
            </div>
          )}
        />
      )
    }}
  </EthereumProvider>
)

Intro.propTypes = {
  getTranslation: PropTypes.func,
  deployedContracts: PropTypes.object
}

export { Intro }
