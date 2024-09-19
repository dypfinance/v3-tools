export const getErrorMessage = e => {
    const message = e?.message || e?.graphQLErrors?.[0]?.errorType || 'Something went wrong!'
    return message
}