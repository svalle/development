var extraFilters;

function addFilter(sKey, sComparator, sVal, bIsString) {
	if (!extraFilters) {
		extraFilters = new Array();
	}

	if (bIsString) {
		sVal = "'" + sVal + "'";
	}

	extraFilters.push(new Array(sKey, sComparator, sVal));
}

function removeFilter(sKey) {
	if (!extraFilters) {
		return;
	}

	for (var i = extraFilters.length - 1; i >= 0; i--) {
		if (extraFilters[i][0] == sKey) {
			extraFilters.splice(i, 1);
			return;
		}
	}
}

function getExtraFilterString() {
	if (!extraFilters) {
		return '';
	}

	var sExtraFilters = '';

	if (extraFilters.length > 0) {
		sExtraFilters = ' AND (';
		var andNeeded = false;

		for (var i = 0; i < extraFilters.length; i++) {
			var arrFilter = extraFilters[i];

			if (andNeeded) {
				sExtraFilters += ' AND ';
			}

			sExtraFilters += $.validator.format("{0} {1} {2}", arrFilter[0], arrFilter[1], arrFilter[2]);
			andNeeded = true;
		}

		sExtraFilters += ')';
	}

	return sExtraFilters;
}
