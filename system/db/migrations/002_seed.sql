-- Sof Expo tadbirlarini seed qilish (5 ta tadbir)
insert into events (id, name, sector, month, starts_on, goal_exhibitors, price_usd_start, notes) values
  ('promotors-show',  'Promotors Show',  'promo', '2025-09', null, 60,  1500, 'Reklama/promo mahsulotlar sanoati'),
  ('build-pro-expo',  'Build Pro Expo',  'build', '2025-10', null, 120, 2900, 'Qurilish, interyer, materiallar — pilot tadbir'),
  ('food-era',        'Food Era',        'food',  '2025-11', null, 100, 2500, 'Oziq-ovqat, ichimlik, HoReCa'),
  ('agro-pro-expo',   'Agro Pro Expo',   'agro',  '2027-03', null, 100, 2500, 'Qishloq xo''jaligi texnikasi, agro'),
  ('edu-expo',        'Edu Expo',        'edu',   '2027-04', null, 60,  2000, 'Ta''lim, EdTech')
on conflict (id) do nothing;
