module.exports = function(transaction) {
	transaction.validatesUniquenessOf('Authority', {message: 'Authority is not Unique'});
}
