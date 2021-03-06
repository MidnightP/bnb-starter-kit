export const capitalizeFirst = string => string.charAt(0).toUpperCase() + string.slice(1)

export const sanitize = input => input ? input.replace(/[-[\]/{}()*+?.^$|<>]/g, '\\$&').trim() : ''

export const getErrorObject = (error) => ({
	errorName:    error ? error.name    : null,
	errorMessage: error ? error.message : null,
	errorCode:    error ? error.code    : null,
})
