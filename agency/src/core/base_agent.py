"""
BaseAgent — barcha agentlar uchun asosiy klass (SKELET).

Vazifasi (keyingi bosqichda yoziladi):
- config/<id>.yaml dan rol, model, delegatsiya, tools yuklash
- Hermes xotirasini (memory/*.md) o'qish/yozish
- Boshliqdan vazifa qabul qilish, bo'ysunuvchilarga delegatsiya qilish
- Claude (Anthropic SDK) orqali ishlash

TODO: implementatsiya. Hozircha faqat arxitektura skeleti.
"""

# class BaseAgent:
#     def __init__(self, config_path: str): ...
#     def receive(self, task): ...        # boshliqdan vazifa
#     def delegate(self, sub_id, task): ...# bo'ysunuvchiga
#     def remember(self, lesson): ...      # Hermes memory append
#     def recall(self): ...                # memory o'qish
#     def act(self, task): ...             # Claude bilan bajarish
