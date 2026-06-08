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
  
    var resp = parseVar(getValue("multi_resp"));
    var grp = parseVar(getValue("multi_group"));
    var df = resp.df;
    var method = getValue("multi_method");
    var cmd = "";
    if (df != "" && resp.raw_col != "" && grp.raw_col != "") {
        var formula = resp.form_col + " ~ " + grp.form_col;
        if (method == "eta_sq") cmd = "rstatix::eta_squared(stats::aov(" + formula + ", data = " + df + "))";
        else if (method == "anova_stats") cmd = "sjstats::anova_stats(stats::aov(" + formula + ", data = " + df + "))";
        else if (method == "epsilon_sq") cmd = "rcompanion::epsilonSquared(x = " + df + "[['" + resp.raw_col + "']], g = " + df + "[['" + grp.raw_col + "']])";
    }
  
    echo("require(rstatix)\nrequire(sjstats)\nrequire(rcompanion)\n");
    if (cmd != "") echo("preview_data <- as.data.frame(" + cmd + ")\n");
  
}

function preprocess(is_preview){
	// add requirements etc. here
	if(is_preview) {
		echo("if(!base::require(rstatix)){stop(" + i18n("Preview not available, because package rstatix is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(rstatix)\n");
	}	if(is_preview) {
		echo("if(!base::require(sjstats)){stop(" + i18n("Preview not available, because package sjstats is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(sjstats)\n");
	}	if(is_preview) {
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
  
    var resp = parseVar(getValue("multi_resp"));
    var grp = parseVar(getValue("multi_group"));
    var df = resp.df;
    var method = getValue("multi_method");
    var cmd = "";
    if (df != "" && resp.raw_col != "" && grp.raw_col != "") {
        var formula = resp.form_col + " ~ " + grp.form_col;
        if (method == "eta_sq") cmd = "rstatix::eta_squared(stats::aov(" + formula + ", data = " + df + "))";
        else if (method == "anova_stats") cmd = "sjstats::anova_stats(stats::aov(" + formula + ", data = " + df + "))";
        else if (method == "epsilon_sq") cmd = "rcompanion::epsilonSquared(x = " + df + "[['" + resp.raw_col + "']], g = " + df + "[['" + grp.raw_col + "']])";
    }
  if (cmd != "") echo("multi_effect <- " + cmd + "\n");
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Multi-Group Effect Sizes results")).print();	
	}
    var method = getValue("multi_method");
    var label = 'Effect Size';
    if (method == 'eta_sq') label = 'Eta Squared';
    else if (method == 'anova_stats') label = 'ANOVA Stats';
    else if (method == 'epsilon_sq') label = 'Epsilon Squared';

    echo("if (is.data.frame(multi_effect)) {\n");
    echo("  rk.print(as.data.frame(multi_effect))\n");
    echo("} else {\n");
    echo("  rk.results(list('" + label + "' = multi_effect))\n");
    echo("}\n");
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var multiSaveObj = getValue("multi_save_obj");
		var multiSaveObjActive = getValue("multi_save_obj.active");
		var multiSaveObjParent = getValue("multi_save_obj.parent");
		// assign object to chosen environment
		if(multiSaveObjActive) {
			echo(".GlobalEnv$" + multiSaveObj + " <- multi_effect\n");
		}	
	}

}

