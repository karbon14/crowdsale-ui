import React from 'react'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import Component from '@reactions/component'
import style from './style.scss'
import { Form } from './Form'
import { EthereumProvider } from './Utils/EthereumProvider'
import './Assets/overlay.png'
import CrowdsaleABI from './ABIs/Crowdsale-ABI.json'
import Karbon14TokenABI from './ABIs/Karbon14Token-ABI.json'

const SetMethodValue = async (method, setState, prop, params) => {
  await method(params, (err, res) => {
    if (err) return
    if (res) {
      const c = get(res, 'c', [])
      setState({ [prop]: c.length ? c[0] : res })
    }
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
    {({ accounts = {}, deployedContracts = [], web3 }) => {
      const { Karbon14Crowdsale = {}, Karbon14Token = {} } = deployedContracts
      return (
        <Component
          initialState={{
            totalSupply: undefined,
            name: undefined,
            ticker: undefined,
            balanceOf: undefined
          }}
          render={({ state, setState }) => {
            if (Karbon14Crowdsale.address) {
              !state.totalSupply &&
                SetMethodValue(
                  Karbon14Crowdsale.getTokenTotalSupply,
                  setState,
                  'totalSupply'
                )
            }

            if (Karbon14Token.address) {
              !state.name &&
                SetMethodValue(Karbon14Token.name, setState, 'name')
              !state.ticker &&
                SetMethodValue(Karbon14Token.symbol, setState, 'ticker')
              !state.balanceOf &&
                SetMethodValue(
                  Karbon14Token.balanceOf,
                  setState,
                  'balanceOf',
                  accounts.addresses[0]
                )
            }

            return (
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
                            <div className="side">
                              <h2>{accounts ? accounts.addresses[0] : ''}</h2>
                              <p>{getTranslation('intro.currentAccount')}</p>
                            </div>
                            <div className="side">
                              <h2>{Karbon14Token.address}</h2>
                              <p>{getTranslation('intro.tokenAddress')}</p>
                            </div>
                            <div className="side">
                              <h2>{Karbon14Crowdsale.address}</h2>
                              <p>{getTranslation('intro.crowdsaleAddress')}</p>
                            </div>
                            <div className="side double">
                              <div>
                                <h2>{state.name}</h2>
                                <p>{getTranslation('intro.name')}</p>
                              </div>
                              <div>
                                <h2>{state.ticker}</h2>
                                <p>{getTranslation('intro.ticker')}</p>
                              </div>
                            </div>
                            <div className="side">
                              {state.totalSupply && (
                                <h2>{`${state.totalSupply} ${
                                  state.ticker
                                }`}</h2>
                              )}
                              <p>{getTranslation('intro.supply')}</p>
                            </div>
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
            )
          }}
        />
      )
    }}
  </EthereumProvider>
)

Intro.propTypes = {
  getTranslation: PropTypes.func
}

export { Intro }
