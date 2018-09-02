import React from 'react'
import style from './style.scss'
import Header from '../../Components/Header'
import { LanguageContext } from '../../Components/SwitcherLang/'
import { Crowdsale } from './Crowdsale'

const Karbon = () => (
  <LanguageContext.Consumer>
    {({ getTranslation, selectedLanguage }) => (
      <div className="karbon">
        <Header
          getTranslation={getTranslation}
          sections={[]}
          homeURL={process.env.HOME_URL}
        />
        <Crowdsale
          getTranslation={getTranslation}
          selectedLanguage={selectedLanguage}
        />
        <style jsx>{style}</style>
      </div>
    )}
  </LanguageContext.Consumer>
)

export { Karbon }
