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
  
    var resp = parseVar(getValue("two_resp"));
    var grp = parseVar(getValue("two_group"));
    var df = resp.df;
    var method = getValue("two_method");
    var cmd = "";

    if (df != "" && resp.raw_col != "" && grp.raw_col != "") {
        var formula = resp.form_col + " ~ " + grp.form_col;
        var vec_x = df + "[['" + resp.raw_col + "']]";
        var vec_g = df + "[['" + grp.raw_col + "']]";

        if (method == "cohen_d") {
            cmd = "effsize::cohen.d(" + formula + ", data = " + df + ", hedges.correction = FALSE)";
        } else if (method == "hedges_g") {
            cmd = "effsize::cohen.d(" + formula + ", data = " + df + ", hedges.correction = TRUE)";
        } else if (method == "glass_rb") {
            cmd = "rcompanion::wilcoxonRG(x = " + vec_x + ", g = " + vec_g + ")";
        } else if (method == "wilcox_eff") {
            cmd = "rstatix::wilcox_effsize(" + formula + ", data = " + df + ")";
        }
    }
  
    echo("require(effsize)\nrequire(rcompanion)\nrequire(rstatix)\n");
    if (cmd != "") {
        echo("temp_res <- " + cmd + "\n");
        echo("if (is.data.frame(temp_res)) { preview_data <- as.data.frame(temp_res) } ");
        echo("else if (inherits(temp_res, 'effsize')) { preview_data <- data.frame(Effect_Size = temp_res$estimate, Lower = temp_res$conf.int[1], Upper = temp_res$conf.int[2]) } ");
        echo("else { preview_data <- data.frame(Result = temp_res) }\n");
    }
  
}

function preprocess(is_preview){
	// add requirements etc. here
	if(is_preview) {
		echo("if(!base::require(effsize)){stop(" + i18n("Preview not available, because package effsize is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(effsize)\n");
	}	if(is_preview) {
		echo("if(!base::require(rcompanion)){stop(" + i18n("Preview not available, because package rcompanion is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(rcompanion)\n");
	}	if(is_preview) {
		echo("if(!base::require(rstatix)){stop(" + i18n("Preview not available, because package rstatix is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(rstatix)\n");
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
  
    var resp = parseVar(getValue("two_resp"));
    var grp = parseVar(getValue("two_group"));
    var df = resp.df;
    var method = getValue("two_method");
    var cmd = "";

    if (df != "" && resp.raw_col != "" && grp.raw_col != "") {
        var formula = resp.form_col + " ~ " + grp.form_col;
        var vec_x = df + "[['" + resp.raw_col + "']]";
        var vec_g = df + "[['" + grp.raw_col + "']]";

        if (method == "cohen_d") {
            cmd = "effsize::cohen.d(" + formula + ", data = " + df + ", hedges.correction = FALSE)";
        } else if (method == "hedges_g") {
            cmd = "effsize::cohen.d(" + formula + ", data = " + df + ", hedges.correction = TRUE)";
        } else if (method == "glass_rb") {
            cmd = "rcompanion::wilcoxonRG(x = " + vec_x + ", g = " + vec_g + ")";
        } else if (method == "wilcox_eff") {
            cmd = "rstatix::wilcox_effsize(" + formula + ", data = " + df + ")";
        }
    }
  if (cmd != "") { echo("twosample_effect <- " + cmd + "\n"); }
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Calculate Effect Sizes results")).print();	
	}
    var method = getValue("two_method");
    var label = 'Effect Size';
    if (method == 'cohen_d') label = 'Cohen\'s d';
    else if (method == 'hedges_g') label = 'Hedges\' g';
    else if (method == 'glass_rb') label = 'Glass rank biserial';
    else if (method == 'wilcox_eff') label = 'Wilcoxon Effect Size';

    echo("if (inherits(twosample_effect, 'effsize')) {\n");
    echo("  rk.results(list('Method' = twosample_effect$method, 'Effect Size Name' = twosample_effect$effect.type, 'Estimate' = twosample_effect$estimate, 'Lower CI' = twosample_effect$conf.int[1], 'Upper CI' = twosample_effect$conf.int[2]))\n");
    echo("} else if (is.data.frame(twosample_effect)) {\n");
    echo("  rk.print(as.data.frame(twosample_effect))\n");
    echo("} else {\n");
    echo("  rk.results(list('" + label + "' = twosample_effect))\n");
    echo("}\n");
  
	if(!is_preview) {
		//// save result object
		// read in saveobject variables
		var twoSaveObj = getValue("two_save_obj");
		var twoSaveObjActive = getValue("two_save_obj.active");
		var twoSaveObjParent = getValue("two_save_obj.parent");
		// assign object to chosen environment
		if(twoSaveObjActive) {
			echo(".GlobalEnv$" + twoSaveObj + " <- twosample_effect\n");
		}	
	}

}

