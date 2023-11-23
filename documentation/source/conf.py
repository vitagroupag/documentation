# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'HIP CDR documentation'
copyright = '2023, vitagroup AG'
author = 'vitagroup AG'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
	'sphinx_rtd_theme',
	'myst_parser',
	'sphinxcontrib.httpdomain'
]
templates_path = ['_templates']
exclude_patterns = []

html_css_files = [
    'css/custom.css',
]

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']

# Enable figure numbering
numfig = True

# (Optional) Format for figure captions
# This example sets the format to "Fig. <number>: Caption"
numfig_format = {
    'figure': 'Fig. %s:',
    'table': 'Table %s:',
    'code-block': 'Listing %s:',
    'section': 'Section %s:'
}