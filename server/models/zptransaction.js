module.exports = function(zptransaction) {
	zptransaction.validatesUniquenessOf('Authority', {message: 'Authority is not Unique'});
}
