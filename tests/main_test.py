from typing import Any


class Error:
    def __init__(self) -> None:
        pass

    def __call__(self, *args: Any, **kwds: Any) -> Any:
        print("hello")

print(Error())