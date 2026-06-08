# rk.effect.sizes

![Version](https://img.shields.io/badge/Version-0.0.1-blue.svg)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![RKWard](https://img.shields.io/badge/Platform-RKWard-green)
[![R Linter](https://github.com/AlfCano/rk.effect.sizes/actions/workflows/lintr.yml/badge.svg)](https://github.com/AlfCano/rk.effect.sizes/actions/workflows/lintr.yml)
![AI Gemini](https://img.shields.io/badge/AI-Gemini-4285F4?logo=googlegemini&logoColor=white)

**An RKWard GUI Plugin for Parametric and Non-Parametric Effect Size Calculations**

`rk.effect.sizes` provides a seamless, point-and-click graphical interface inside RKWard to calculate effect sizes for various statistical experimental designs. Acting as a unified GUI wrapper for powerful statistical R packages like [`effsize`](https://cran.r-project.org/package=effsize), [`rstatix`](https://cran.r-project.org/package=rstatix), [`sjstats`](https://cran.r-project.org/package=sjstats), and [`rcompanion`](https://cran.r-project.org/package=rcompanion), this plugin allows users to compute essential metrics like Cohen's d, Eta Squared, and Kendall's W without writing a single line of code.

This package includes a **multi-component workflow** structured neatly by experimental design (Two-Sample, Multi-Group, and Repeated Measures) to keep the interface clean and intuitive.

---

## 🌟 Key Features

* **Zero-Code Calculations:** Easily compute effect sizes for T-tests, ANOVAs, Wilcoxon, and Friedman tests directly from your dataframes.
* **Comprehensive Statistical Methods:** 
  * *Two-Sample:* Cohen's d, Hedges' g, Glass rank biserial, and Wilcoxon Effect Size.
  * *Multi-Group/ANOVA:* Eta Squared, ANOVA Stats, and Epsilon-squared.
  * *Repeated Measures:* Kendall's W.
* **Smart Formatting Output:** Automatically detects the output type (tibbles, lists, or raw numerics) and dynamically formats them into clean, readable HTML tables using `rk.results()` and `rk.print()`.
* **Dynamic Code Generation:** The generated R script intelligently adapts its labels and variable names based on your selected method.
* **Multilingual:** Fully translated into English, Spanish, French, German, and Portuguese (Brazil).

---

## ⚙️ Prerequisites

You must have [RKWard](https://rkward.kde.org/) installed along with the following R packages:

```R
install.packages(c("effsize", "rstatix", "sjstats", "rcompanion"))
```

---

## 🚀 Installation

You can install this plugin directly from GitHub using `devtools`:

```R
# Install the plugin
devtools::install_github("AlfCano/rk.effect.sizes")
```

Once installed, open RKWard, navigate to **Settings -> Configure RKWard -> Plugins**, and activate `rk.effect.sizes`.

---

## 🛠️ Usage Workflow

This plugin adds three new tools to your RKWard menus, neatly categorized under the **Analysis** tab:

### 1. Two-Sample Effect Sizes
**Navigate to:** `Analysis` ➔ `Effect Sizes` ➔ `Two-Sample Effect Sizes`

* **Variables:** Select your numeric Response Variable and a Grouping Variable (strictly 2 levels).
* **Method:** Choose between parametric (Cohen's d, Hedges' g) or non-parametric methods (Glass rank biserial, Wilcoxon).
* **Output:** Preview the results instantly or submit to render the formatted HTML table with Estimates and Confidence Intervals.

### 2. Multi-Group / ANOVA Effect Sizes
**Navigate to:** `Analysis` ➔ `Effect Sizes` ➔ `Multi-Group Effect Sizes`

* **Variables:** Select your numeric Response Variable and a Grouping Variable (3 or more levels).
* **Method:** Choose your preferred variance decomposition metric (Eta Squared, ANOVA Stats, or Epsilon-squared).
* **Output:** Generates a data frame mapping the effect size to your ANOVA terms.

### 3. Repeated Measures Effect Sizes
**Navigate to:** `Analysis` ➔ `Effect Sizes` ➔ `Repeated Measures Effect Size`

* **Variables:** Ideal for Friedman tests. Select your Response, your Condition (treatment), and your Subject/Block variable.
* **Output:** Instantly computes and formats Kendall's W for dependent/related samples.

---

## 🌍 Internationalization (i18n)

The graphical interface automatically adapts to your RKWard language settings. Currently supported languages:
* 🇺🇸 English (Default)
* 🇪🇸 Spanish (Español)
* 🇫🇷 French (Français)
* 🇩🇪 German (Deutsch)
* 🇧🇷 Portuguese (Português do Brasil)

---

## 📝 License and Author

**Author:** Alfonso Cano ([@AlfCano](https://github.com/AlfCano))  
**Email:** alfonso.cano@correo.buap.mx  
*   **Assisted by:** Gemini, a large language model from Google.
*   **License:** GPL (>= 3)

This project is licensed under the **GPL (>= 3)** License.
