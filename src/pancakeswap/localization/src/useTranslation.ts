import { useContext } from 'react'
import { LanguageContext } from './Provider'
import { EN, languages } from './config/languages'

const useTranslation = () => {
  const languageContext = useContext(LanguageContext)
//console.log(languageContext)
  if (languageContext === undefined) {
   // throw new Error('Language context is undefined')
  // console.log("Language Context undefinedd")

   return {currentLanguage: EN,setLanguage:()=> {

   }, t: () => {

   }}
  }

  return languageContext
}

export default useTranslation
