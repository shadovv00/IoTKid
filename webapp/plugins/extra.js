Date.prototype.getLocalTotalPassedDays = function() {
	/**
	 * for each GMT javascript Date object consider new day beginning from -GMT
	 * so for enforce Date count days starting from midnight day calculation
	 * must be shifted for GMT
	*/
	return Math.floor((+this - this.getTimezoneOffset() * 60 * 1000) / 864e5);
};