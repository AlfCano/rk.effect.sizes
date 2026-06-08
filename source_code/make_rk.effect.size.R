local({
  # =========================================================================================
  # 1. Definición del Paquete y Metadatos
  # =========================================================================================
  require(rkwarddev)
  rkwarddev.required("0.10-3")

  package_about <- rk.XML.about(
    name = "rk.effect.sizes",
    author = person(
      given = "Alfonso",
      family = "Cano",
      email = "alfonso.cano@correo.buap.mx",
      role = c("aut", "cre")
    ),
    about = list(
      desc = "An RKWard plugin for parametric and non-parametric Effect Size calculations.",
      version = "0.0.1",
      url = "https://github.com/AlfCano/rk.effect.sizes",
      license = "GPL (>= 3)"
    )
  )

  common_hierarchy <- list("analysis", "Effect Sizes")

  # =========================================================================================
  # 2. JS Helper (Parsing de variables)
  # =========================================================================================
  js_parse_helper <- "
    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: '', form_col: ''};
        var df = '';
        var raw_col = '';
        if (fullPath.indexOf('[[') > -1) {
            var parts = fullPath.split('[[');
            df = parts[0];
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/[\\\"']/g, '');
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
  "

  # =========================================================================================
  # COMPONENTE 1: Two-Sample Effect Sizes
  # =========================================================================================
  two_var_selector <- rk.XML.varselector(id.name = "two_selector")
  two_resp <- rk.XML.varslot(label = "Response Variable (Numeric)", source = "two_selector", classes = "numeric", required = TRUE, id.name = "two_resp")
  two_group <- rk.XML.varslot(label = "Grouping Variable (2 levels)", source = "two_selector", required = TRUE, id.name = "two_group")

  two_method <- rk.XML.radio(label = "Effect Size Method", options = list(
      "Cohen's d (effsize)" = list(val = "cohen_d", chk = TRUE),
      "Hedges' g (effsize)" = list(val = "hedges_g"),
      "Glass rank biserial (rcompanion)" = list(val = "glass_rb"),
      "Wilcoxon Effect Size (rstatix)" = list(val = "wilcox_eff")
  ), id.name = "two_method")

  two_save <- rk.XML.saveobj(label = "Save result as", chk = TRUE, initial = "twosample_effect", id.name = "two_save_obj")
  two_preview <- rk.XML.preview(mode = "data")

  dialog_twosample <- rk.XML.dialog(
    label = "Two-Sample Effect Sizes",
    child = rk.XML.tabbook(tabs = list(
      "Variables" = rk.XML.row(two_var_selector, rk.XML.col(two_resp, two_group)),
      "Method" = rk.XML.row(two_method),
      "Output" = rk.XML.row(two_save, two_preview)
    ))
  )

  js_body_twosample <- paste0(js_parse_helper, "
    var resp = parseVar(getValue(\"two_resp\"));
    var grp = parseVar(getValue(\"two_group\"));
    var df = resp.df;
    var method = getValue(\"two_method\");
    var cmd = \"\";

    if (df != \"\" && resp.raw_col != \"\" && grp.raw_col != \"\") {
        var formula = resp.form_col + \" ~ \" + grp.form_col;
        var vec_x = df + \"[['\" + resp.raw_col + \"']]\";
        var vec_g = df + \"[['\" + grp.raw_col + \"']]\";

        if (method == \"cohen_d\") {
            cmd = \"effsize::cohen.d(\" + formula + \", data = \" + df + \", hedges.correction = FALSE)\";
        } else if (method == \"hedges_g\") {
            cmd = \"effsize::cohen.d(\" + formula + \", data = \" + df + \", hedges.correction = TRUE)\";
        } else if (method == \"glass_rb\") {
            cmd = \"rcompanion::wilcoxonRG(x = \" + vec_x + \", g = \" + vec_g + \")\";
        } else if (method == \"wilcox_eff\") {
            cmd = \"rstatix::wilcox_effsize(\" + formula + \", data = \" + df + \")\";
        }
    }
  ")

  js_calc_twosample <- paste0(js_body_twosample, "if (cmd != \"\") { echo(\"twosample_effect <- \" + cmd + \"\\n\"); }")

  # === PRINTOUT DINÁMICO ===
  js_print_twosample <- "
    var method = getValue(\"two_method\");
    var label = 'Effect Size';
    if (method == 'cohen_d') label = 'Cohen\\'s d';
    else if (method == 'hedges_g') label = 'Hedges\\' g';
    else if (method == 'glass_rb') label = 'Glass rank biserial';
    else if (method == 'wilcox_eff') label = 'Wilcoxon Effect Size';

    echo(\"if (inherits(twosample_effect, 'effsize')) {\\n\");
    echo(\"  rk.results(list('Method' = twosample_effect$method, 'Effect Size Name' = twosample_effect$effect.type, 'Estimate' = twosample_effect$estimate, 'Lower CI' = twosample_effect$conf.int[1], 'Upper CI' = twosample_effect$conf.int[2]))\\n\");
    echo(\"} else if (is.data.frame(twosample_effect)) {\\n\");
    echo(\"  rk.print(as.data.frame(twosample_effect))\\n\");
    echo(\"} else {\\n\");
    echo(\"  rk.results(list('\" + label + \"' = twosample_effect))\\n\");
    echo(\"}\\n\");
  "

  js_preview_twosample <- paste0(js_body_twosample, "
    echo(\"require(effsize)\\nrequire(rcompanion)\\nrequire(rstatix)\\n\");
    if (cmd != \"\") {
        echo(\"temp_res <- \" + cmd + \"\\n\");
        echo(\"if (is.data.frame(temp_res)) { preview_data <- as.data.frame(temp_res) } \");
        echo(\"else if (inherits(temp_res, 'effsize')) { preview_data <- data.frame(Effect_Size = temp_res$estimate, Lower = temp_res$conf.int[1], Upper = temp_res$conf.int[2]) } \");
        echo(\"else { preview_data <- data.frame(Result = temp_res) }\\n\");
    }
  ")

  comp_twosample <- rk.plugin.component("Two-Sample Effect Sizes",
    xml = list(dialog = dialog_twosample),
    js = list(require=c("effsize", "rcompanion", "rstatix"), calculate = js_calc_twosample, printout = js_print_twosample, preview = js_preview_twosample),
    hierarchy = common_hierarchy
  )

  # =========================================================================================
  # COMPONENTE 2: Multi-Group / ANOVA Effect Sizes
  # =========================================================================================
  multi_var_sel <- rk.XML.varselector(id.name = "multi_selector")
  multi_resp <- rk.XML.varslot(label = "Response Variable", source = "multi_selector", classes = "numeric", required = TRUE, id.name = "multi_resp")
  multi_group <- rk.XML.varslot(label = "Grouping Variable", source = "multi_selector", required = TRUE, id.name = "multi_group")
  multi_method <- rk.XML.radio(label = "Method", options = list(
      "Eta Squared (rstatix)" = list(val = "eta_sq", chk = TRUE),
      "ANOVA Stats (sjstats)" = list(val = "anova_stats"),
      "Epsilon-squared (rcompanion)" = list(val = "epsilon_sq")
  ), id.name = "multi_method")
  multi_save <- rk.XML.saveobj(label = "Save as", chk = TRUE, initial = "multi_effect", id.name = "multi_save_obj")
  multi_preview <- rk.XML.preview(mode = "data")

  dialog_multigroup <- rk.XML.dialog(label = "Multi-Group Effect Sizes",
    child = rk.XML.tabbook(tabs = list(
        "Variables" = rk.XML.row(multi_var_sel, rk.XML.col(multi_resp, multi_group)),
        "Method" = rk.XML.row(multi_method),
        "Output" = rk.XML.row(multi_save, multi_preview)
    ))
  )

  js_body_multi <- paste0(js_parse_helper, "
    var resp = parseVar(getValue(\"multi_resp\"));
    var grp = parseVar(getValue(\"multi_group\"));
    var df = resp.df;
    var method = getValue(\"multi_method\");
    var cmd = \"\";
    if (df != \"\" && resp.raw_col != \"\" && grp.raw_col != \"\") {
        var formula = resp.form_col + \" ~ \" + grp.form_col;
        if (method == \"eta_sq\") cmd = \"rstatix::eta_squared(stats::aov(\" + formula + \", data = \" + df + \"))\";
        else if (method == \"anova_stats\") cmd = \"sjstats::anova_stats(stats::aov(\" + formula + \", data = \" + df + \"))\";
        else if (method == \"epsilon_sq\") cmd = \"rcompanion::epsilonSquared(x = \" + df + \"[['\" + resp.raw_col + \"']], g = \" + df + \"[['\" + grp.raw_col + \"']])\";
    }
  ")

  js_calc_multi <- paste0(js_body_multi, "if (cmd != \"\") echo(\"multi_effect <- \" + cmd + \"\\n\");")

  # === PRINTOUT DINÁMICO ===
  js_print_multi <- "
    var method = getValue(\"multi_method\");
    var label = 'Effect Size';
    if (method == 'eta_sq') label = 'Eta Squared';
    else if (method == 'anova_stats') label = 'ANOVA Stats';
    else if (method == 'epsilon_sq') label = 'Epsilon Squared';

    echo(\"if (is.data.frame(multi_effect)) {\\n\");
    echo(\"  rk.print(as.data.frame(multi_effect))\\n\");
    echo(\"} else {\\n\");
    echo(\"  rk.results(list('\" + label + \"' = multi_effect))\\n\");
    echo(\"}\\n\");
  "

  js_preview_multi <- paste0(js_body_multi, "
    echo(\"require(rstatix)\\nrequire(sjstats)\\nrequire(rcompanion)\\n\");
    if (cmd != \"\") echo(\"preview_data <- as.data.frame(\" + cmd + \")\\n\");
  ")

  comp_multigroup <- rk.plugin.component("Multi-Group Effect Sizes",
    xml = list(dialog = dialog_multigroup),
    js = list(require=c("rstatix", "sjstats", "rcompanion"), calculate = js_calc_multi, printout = js_print_multi, preview = js_preview_multi),
    hierarchy = common_hierarchy
  )

  # =========================================================================================
  # COMPONENTE 3: Repeated Measures (Friedman)
  # =========================================================================================
  rep_var_sel <- rk.XML.varselector(id.name = "rep_selector")
  rep_resp <- rk.XML.varslot(label = "Response", source = "rep_selector", classes = "numeric", required = TRUE, id.name = "rep_resp")
  rep_group <- rk.XML.varslot(label = "Condition", source = "rep_selector", required = TRUE, id.name = "rep_group")
  rep_block <- rk.XML.varslot(label = "Subject/Block", source = "rep_selector", required = TRUE, id.name = "rep_block")
  rep_save <- rk.XML.saveobj(label = "Save as", chk = TRUE, initial = "repeated_effect", id.name = "rep_save_obj")
  rep_preview <- rk.XML.preview(mode = "data")

  dialog_repeated <- rk.XML.dialog(label = "Repeated Measures Effect Size",
    child = rk.XML.tabbook(tabs = list(
        "Variables" = rk.XML.row(rep_var_sel, rk.XML.col(rep_resp, rep_group, rep_block)),
        "Output" = rk.XML.row(rep_save, rep_preview)
    ))
  )

  js_body_rep <- paste0(js_parse_helper, "
    var resp = parseVar(getValue(\"rep_resp\"));
    var grp = parseVar(getValue(\"rep_group\"));
    var blk = parseVar(getValue(\"rep_block\"));
    var df = resp.df;
    var cmd = \"\";
    if (df != \"\" && resp.raw_col != \"\" && grp.raw_col != \"\" && blk.raw_col != \"\") {
        cmd = \"rcompanion::kendallW(x = \" + df + \"[['\" + resp.raw_col + \"']], g = \" + df + \"[['\" + grp.raw_col + \"']], block = \" + df + \"[['\" + blk.raw_col + \"']])\";
    }
  ")

  js_calc_rep <- paste0(js_body_rep, "if (cmd != \"\") echo(\"repeated_effect <- \" + cmd + \"\\n\");")

  js_print_rep <- "
    echo(\"if (is.data.frame(repeated_effect)) {\\n\");
    echo(\"  rk.print(as.data.frame(repeated_effect))\\n\");
    echo(\"} else {\\n\");
    echo(\"  rk.results(list('Kendall W' = repeated_effect))\\n\");
    echo(\"}\\n\");
  "

  js_preview_rep <- paste0(js_body_rep, "
    echo(\"require(rcompanion)\\n\");
    if (cmd != \"\") echo(\"preview_data <- data.frame(Kendall_W = \" + cmd + \")\\n\");
  ")

  comp_repeated <- rk.plugin.component("Repeated Measures Effect Sizes",
    xml = list(dialog = dialog_repeated),
    js = list(require="rcompanion", calculate = js_calc_rep, printout = js_print_rep, preview = js_preview_rep),
    hierarchy = common_hierarchy
  )

  # =========================================================================================
  # 3. CONSTRUCCIÓN DEL ESQUELETO
  # =========================================================================================

  rk.plugin.skeleton(
    about = package_about,
    path = ".",
    xml = list(dialog = dialog_twosample),
    js = list(
        require = c("effsize", "rcompanion", "rstatix"),
        calculate = js_calc_twosample,
        printout = js_print_twosample,
        preview = js_preview_twosample
    ),
    components = list(
        comp_multigroup,
        comp_repeated
    ),
    pluginmap = list(
        name = "Calculate Effect Sizes",
        hierarchy = common_hierarchy
    ),
    create = c("pmap", "xml", "js", "desc", "rkh"),
    load = TRUE,
    overwrite = TRUE,
    show = FALSE
  )

  cat("\nPlugin 'rk.effect.sizes' (v0.0.1) generado con éxito.\n")
})
