import React from 'react'
import style from './style.scss'
import Header from '../../Components/Header'
import { LanguageContext } from '../../Components/SwitcherLang/'
import { Intro } from './Sections'

const Karbon = () => (
  <LanguageContext.Consumer>
    {({ getTranslation }) => (
      <div className="karbon">
        <Header
          getTranslation={getTranslation}
          sections={[]}
          homeURL={process.env.HOME_URL}
        />
        <Intro getTranslation={getTranslation} />
        <style jsx>{style}</style>
      </div>
    )}
  </LanguageContext.Consumer>
)

export { Karbon }
