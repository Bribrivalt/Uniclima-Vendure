import { gql } from '@apollo/client';
import { ERROR_RESULT_FRAGMENT } from '../queries/auth';

/**
 * Mutation para autenticar usuario
 */
export const LOGIN_MUTATION = gql`
  ${ERROR_RESULT_FRAGMENT}
  mutation Login($email: String!, $password: String!) {
    login(username: $email, password: $password) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on InvalidCredentialsError {
        ...ErrorResult
      }
      ... on NativeAuthStrategyError {
        ...ErrorResult
      }
    }
  }
`;

/**
 * Mutation para registrar nuevo cliente
 */
export const REGISTER_MUTATION = gql`
  ${ERROR_RESULT_FRAGMENT}
  mutation RegisterCustomerAccount($input: RegisterCustomerInput!) {
    registerCustomerAccount(input: $input) {
      ... on Success {
        success
      }
      ... on MissingPasswordError {
        ...ErrorResult
      }
      ... on PasswordValidationError {
        ...ErrorResult
      }
      ... on NativeAuthStrategyError {
        ...ErrorResult
      }
    }
  }
`;

/**
 * Mutation para cerrar sesión
 */
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;

/**
 * Mutation para verificar email (si aplica)
 */
export const VERIFY_EMAIL_MUTATION = gql`
  ${ERROR_RESULT_FRAGMENT}
  mutation VerifyCustomerAccount($token: String!) {
    verifyCustomerAccount(token: $token) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on VerificationTokenInvalidError {
        ...ErrorResult
      }
      ... on VerificationTokenExpiredError {
        ...ErrorResult
      }
    }
  }
`;

/**
 * Mutation para solicitar reset de contraseña
 */
export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  ${ERROR_RESULT_FRAGMENT}
  mutation RequestPasswordReset($emailAddress: String!) {
    requestPasswordReset(emailAddress: $emailAddress) {
      ... on Success {
        success
      }
      ... on NativeAuthStrategyError {
        ...ErrorResult
      }
    }
  }
`;

/**
 * Mutation para resetear contraseña
 */
export const RESET_PASSWORD_MUTATION = gql`
  ${ERROR_RESULT_FRAGMENT}
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      ... on CurrentUser {
        id
        identifier
      }
      ... on PasswordResetTokenInvalidError {
        ...ErrorResult
      }
      ... on PasswordResetTokenExpiredError {
        ...ErrorResult
      }
      ... on PasswordValidationError {
        ...ErrorResult
      }
      ... on NativeAuthStrategyError {
        ...ErrorResult
      }
    }
  }
`;
