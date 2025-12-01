import { gql } from '@apollo/client';

// Login mutation
export const LOGIN_MUTATION = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            ... on CurrentUser {
                id
                identifier
            }
            ... on InvalidCredentialsError {
                errorCode
                message
            }
            ... on NotVerifiedError {
                errorCode
                message
            }
            ... on NativeAuthStrategyError {
                errorCode
                message
            }
        }
    }
`;

// Register new customer
export const REGISTER_MUTATION = gql`
    mutation Register($input: RegisterCustomerInput!) {
        registerCustomerAccount(input: $input) {
            ... on Success {
                success
            }
            ... on MissingPasswordError {
                errorCode
                message
            }
            ... on PasswordValidationError {
                errorCode
                message
                validationErrorMessage
            }
            ... on NativeAuthStrategyError {
                errorCode
                message
            }
        }
    }
`;

// Logout mutation
export const LOGOUT_MUTATION = gql`
    mutation Logout {
        logout {
            success
        }
    }
`;

// Get current user/customer
export const GET_ACTIVE_CUSTOMER = gql`
    query GetActiveCustomer {
        activeCustomer {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
            addresses {
                id
                fullName
                streetLine1
                streetLine2
                city
                province
                postalCode
                country {
                    code
                    name
                }
                phoneNumber
                defaultShippingAddress
                defaultBillingAddress
            }
            orders(options: { take: 10, sort: { createdAt: DESC } }) {
                items {
                    id
                    code
                    state
                    total
                    createdAt
                }
                totalItems
            }
        }
    }
`;

// Request password reset
export const REQUEST_PASSWORD_RESET = gql`
    mutation RequestPasswordReset($emailAddress: String!) {
        requestPasswordReset(emailAddress: $emailAddress) {
            ... on Success {
                success
            }
            ... on NativeAuthStrategyError {
                errorCode
                message
            }
        }
    }
`;

// Reset password with token
export const RESET_PASSWORD = gql`
    mutation ResetPassword($token: String!, $password: String!) {
        resetPassword(token: $token, password: $password) {
            ... on CurrentUser {
                id
                identifier
            }
            ... on PasswordResetTokenInvalidError {
                errorCode
                message
            }
            ... on PasswordResetTokenExpiredError {
                errorCode
                message
            }
            ... on PasswordValidationError {
                errorCode
                message
                validationErrorMessage
            }
            ... on NativeAuthStrategyError {
                errorCode
                message
            }
            ... on NotVerifiedError {
                errorCode
                message
            }
        }
    }
`;

// Update customer details
export const UPDATE_CUSTOMER = gql`
    mutation UpdateCustomer($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            id
            firstName
            lastName
            emailAddress
            phoneNumber
        }
    }
`;

// Add to cart
export const ADD_TO_CART = gql`
    mutation AddToCart($productVariantId: ID!, $quantity: Int!) {
        addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {
            ... on Order {
                id
                code
                totalQuantity
                subTotal
                total
                lines {
                    id
                    quantity
                    productVariant {
                        id
                        name
                        price
                    }
                }
            }
            ... on OrderModificationError {
                errorCode
                message
            }
            ... on OrderLimitError {
                errorCode
                message
            }
            ... on NegativeQuantityError {
                errorCode
                message
            }
            ... on InsufficientStockError {
                errorCode
                message
                quantityAvailable
            }
        }
    }
`;

// Get active order (cart)
export const GET_ACTIVE_ORDER = gql`
    query GetActiveOrder {
        activeOrder {
            id
            code
            state
            totalQuantity
            subTotal
            shipping
            total
            lines {
                id
                quantity
                unitPrice
                linePrice
                productVariant {
                    id
                    name
                    sku
                    price
                    product {
                        id
                        name
                        slug
                        featuredAsset {
                            preview
                        }
                    }
                }
            }
        }
    }
`;

// Update cart item quantity
export const UPDATE_CART_ITEM = gql`
    mutation UpdateCartItem($lineId: ID!, $quantity: Int!) {
        adjustOrderLine(orderLineId: $lineId, quantity: $quantity) {
            ... on Order {
                id
                totalQuantity
                total
                lines {
                    id
                    quantity
                }
            }
            ... on OrderModificationError {
                errorCode
                message
            }
            ... on OrderLimitError {
                errorCode
                message
            }
            ... on NegativeQuantityError {
                errorCode
                message
            }
            ... on InsufficientStockError {
                errorCode
                message
            }
        }
    }
`;

// Remove item from cart
export const REMOVE_FROM_CART = gql`
    mutation RemoveFromCart($lineId: ID!) {
        removeOrderLine(orderLineId: $lineId) {
            ... on Order {
                id
                totalQuantity
                total
            }
            ... on OrderModificationError {
                errorCode
                message
            }
        }
    }
`;