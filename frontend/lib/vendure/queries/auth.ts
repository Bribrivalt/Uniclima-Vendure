import { gql } from '@apollo/client';

/**
 * Query para obtener el cliente activo (usuario autenticado)
 */
export const GET_ACTIVE_CUSTOMER = gql`
  query GetActiveCustomer {
    activeCustomer {
      id
      title
      firstName
      lastName
      emailAddress
      phoneNumber
    }
  }
`;

/**
 * Fragment para datos de error
 */
export const ERROR_RESULT_FRAGMENT = gql`
  fragment ErrorResult on ErrorResult {
    errorCode
    message
  }
`;
