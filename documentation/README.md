Linux prerequisites
--------------------

- Sphinx needs python 3.6+ installed on your linux system
- if you have python 2 installed, it won't work.

Windows prerequisites
----------------------

Sphinx needs Python 3.6+ to operate on windows.

To setup Python:

- download & install Python 3 for windows here: https://www.python.org/downloads/
- activate "[x] add python.exe into PATH" in setup dialog

Installation should be straight forward. Please note that you might need to replace 'pip' with 'pip3' depending on your already installed python version.

After installation, open windows command shell and check if python can be called:

```
python --version
```

Output should report the installed Python version, e.g.

```
Python 3.12.0
```

Installing Sphinx
-----------------------

Open windows/linux command shell and install sphinx by typing

```
pip install -U sphinx
```

In addition install the following python modules (if not already installed) that are required by Sphinx for document generation:

```
pip install sphinx_rtd_theme
pip install sphinxcontrib-httpdomain
pip install --upgrade myst-parser
```


Build documentation
-------------------

To initially build or rebuild your html documentation, change into the documentation's root folder (folder where this `README.md` file is located) and run:

```
./make html 
```
 
The generated documentation can be found in `build\html`
 

Use vscode and LIVE preview in your local browser
--------------------------------------------------
**Installation & setup**

- Download latest version of **vscode** here: https://code.visualstudio.com/download
- After installation, run vscode and install 2 plugins
  - **Live Server** plugin
  - **File Watcher** plugin
- Open documentation root folder (folder where this `README.md` is located) in vscode workspace via `File|Open Folder`
- After opening the workspace in vscode, start the live preview server by clicking the bottom right status bar icon `((i)) Go Live`
- Your browser should start automatically. If not, the live preview should be available under `http://127.0.0.1:5858`


**Live-preview**

When you change ANY doc resource in the `./source` folder, the doc preview in your browser will automatically reload after a view seconds!

Why? The File watcher plugin will detect the file changes and automatically call the `make html` script.

Troubleshooting
---------------

If you encounter  problems using Sphinx, try to install a newer version of Python or Sphinx. To check, which Sphinx version is currently installed, type


```
$ python -m pip list | grep sphinx
```
