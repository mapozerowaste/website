import os


def launch_opts():
    """CHROME_PATH가 있으면 그 크롬, 없고 /usr/bin/google-chrome이 있으면 그것, 아니면 playwright가 설치한 크롬."""
    o = {'args': ['--no-sandbox']}
    path = os.environ.get('CHROME_PATH') or ('/usr/bin/google-chrome' if os.path.exists('/usr/bin/google-chrome') else '')
    if path:
        o['executable_path'] = path
    return o
