// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!

function preview(){
	
    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: '', form_col: ''};
        var df = '';
        var raw_col = '';
        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/[\"']/g, '');
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        var form_col = '`' + raw_col + '`';
        return { df: df, raw_col: raw_col, form_col: form_col };
    }
  
    var resp = parseVar(getValue("rep_resp"));
    var grp = parseVar(getValue("rep_group"));
    var blk = parseVar(getValue("rep_block"));
    var df = resp.df;
    var cmd = "";
    if (df != "" && resp.raw_col != "" && grp.raw_col != "" && blk.raw_col != "") {
        cmd = "rcompanion::kendallW(x = " + df + "[['" + resp.raw_col + "']], g = " + df + "[['" + grp.raw_col + "']], block = " + df + "[['" + blk.raw_col + "']])";
    }
  
    echo("require(rcompanion)\n");
    if (cmd != "") echo("preview_data <- data.frame(Kendall_W = " + cmd + ")\n");
  
}

function preprocess(is_preview){
	// add requirements etc. here
	if(is_preview) {
		echo("if(!base::require(rcompanion)){stop(" + i18n("Preview not available, because package rcompanion is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(rcompanion)\n");
	}
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: '', form_col: ''};
        var df = '';
        var raw_col = '';
        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/[\"']/g, '');
        } else if (fullPath.indexOf('$') > -1) {
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        var form_col = '`' + raw_col + '`';
        return { df: df, raw_col: raw_col, form_col: form_col };
    }
  
    var resp = parseVar(getValue("rep_resp"));
    var grp = parseVar(getValue("rep_group"));
    var blk = parseVar(getValue("rep_block"));
    var df = resp.df;
    var cmd = "";
    if (df != "" && resp.raw_col != "" && grp.raw_col != "" && blk.raw_col != "") {
        cmd = "rcompanion::kendallW(x = " + df + "[['" + resp.raw_col + "']], g = " + df + "[['" + grp.raw_col + "']], block = " + df + "[['" + blk.raw_col + "']])";
    }
  if (cmd != "") echo("repeated_effect <- " + cmd + "\n");
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Repeated Measures Effect Sizes results")).print();	
	}
    echo("if (is.data.frame(repeated_effect)) {\n");
    echo("  rk.print(as.data.frame(repeated_effect))\n");
    echo("} else {\n");
    echo("  rk.results(list('Kendall W' = repeated_effect))\n");
    echo("}\n");
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var repSaveObj = getValue("rep_save_obj");
		var repSaveObjActive = getValue("rep_save_obj.active");
		var repSaveObjParent = getValue("rep_save_obj.parent");
		// assign object to chosen environment
		if(repSaveObjActive) {
			echo(".GlobalEnv$" + repSaveObj + " <- repeated_effect\n");
		}	
	}

}

