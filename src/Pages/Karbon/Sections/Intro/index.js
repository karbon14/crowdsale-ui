import React from 'react'
import PropTypes from 'prop-types'
import Component from '@reactions/component'
import style from './style.scss'
import { Form } from './Form'
import { EthereumProvider } from './Utils/EthereumProvider'
import './Assets/overlay.png'
import CrowdsaleABI from './ABIs/Crowdsale-ABI.json'
import Karbon14TokenABI from './ABIs/Karbon14Token-ABI.json'

const SetMethodValue = async (method, setState, prop, params) => {
  const m = params ? method(params) : method()
  await m.call().then(r => {
    setState({ [prop]: r })
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
      console.log('deployedContracts: ', deployedContracts)
      console.log('accounts: ', accounts)
      console.log('web3: ', web3)
      return (
        <Component
          initialState={{
            totalSupply: undefined,
            name: undefined,
            ticker: undefined,
            balanceOf: undefined
          }}
          render={({ state, setState }) => {
            if (Karbon14Crowdsale.methods) {
              const crowdsaleMethods = Karbon14Crowdsale.methods
              !state.totalSupply &&
                SetMethodValue(
                  crowdsaleMethods.getTokenTotalSupply,
                  setState,
                  'totalSupply'
                )
            }
            if (Karbon14Token.methods) {
              const TokenMethods = Karbon14Token.methods
              !state.name && SetMethodValue(TokenMethods.name, setState, 'name')
              !state.ticker &&
                SetMethodValue(TokenMethods.symbol, setState, 'ticker')
              !state.balanceOf &&
                SetMethodValue(
                  TokenMethods.balanceOf,
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
                              <h2>{Karbon14Token._address}</h2>
                              <p>{getTranslation('intro.tokenAddress')}</p>
                            </div>
                            <div className="side">
                              <h2>{Karbon14Crowdsale._address}</h2>
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
                        buyTokens={
                          Karbon14Crowdsale.methods &&
                          Karbon14Crowdsale.methods.buyTokens
                        }
                        web3={global.web3}
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
