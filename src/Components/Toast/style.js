import css from 'styled-jsx/css'
import style from 'react-toastify/dist/ReactToastify.css'

export default css`
${/*eslint-disable-line prettier/prettier */''}
${style}
  .Toastify__toast-container {
    .Toastify__toast {
      &--error {
        background: #fc5454;

        &:before {
          content: '\f00d';
        }
      }

      &--success {
        background: #2fab72;

        &:before {
          content: '\f058';
        }
      }

      &--warning {
        background: #ffc901;

        &:before {
          content: '\f071';
        }
      }

      &--info {
        background: #1641b5;

        &:before {
          content: '\f05a';
        }
      }

      &:before {
        font-family: FontAwesome;
        font-size: 24px;
        height: 100%;
        transform: translateY(70%);
        margin: 0 12px 0 10px;
      }
    }

    &--top-right {
      top: 4em;
    }

    .Toastify__close-button {
      display: none;
    }
  }
`
