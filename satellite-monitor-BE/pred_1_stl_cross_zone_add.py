import math
import ephem
import datetime
from geopy.geocoders import Nominatim
from deep_translator import GoogleTranslator
import requests

#  open file and read data
f = open('data.txt', 'r')
line = f.readlines()

# input positions of observer
obs_center = ephem.Observer()
obs_center.lat = '4.0936392460684345'
obs_center.long = '27.72342623815178'
obs1_lat = '5.380658462787681'
obs1_long = '31.935151722602303'
obs2_lat = '0.49875311596690386'
obs2_long = '33.20900555411155'
obs3_lat = '1.2022432472644662'
obs3_long = '22.798544931087733'
obs4_lat = '11.329564658875363'
obs4_long = '23.63313882069725'

# input time and constants
const = 0.01746031
time1_input = input('Enter a datetime1 in YYYY-MM-DD HH:MM:SS format: ')  # interested local time
time2_input = input('Enter a datetime2 in YYYY-MM-DD HH:MM:SS format: ')
time1 = datetime.datetime.strptime(time1_input, '%Y-%m-%d %H:%M:%S')
time2 = datetime.datetime.strptime(time2_input, '%Y-%m-%d %H:%M:%S')
timeutc1 = ephem.Date(time1)  # convert interested local time to ephem.Date
timeutc2 = ephem.Date(time2)
t1 = ephem.Date(timeutc1-7*ephem.hour)  # convert interested local time to utc time in ephem.Date
t2 = ephem.Date(timeutc2-7*ephem.hour)
alpha = ephem.degrees('45:00:00')  # minimum elevation
R = 6371  # ban kinh Trai Dat


def orbit_stl(tr, tt, ts):  # hàm tính quỹ đạo vệ tinh
    #  tính bán kính vùng phủ tại thời điểm tt
    global i, k
    obs_center.date = tt
    stl.compute(obs_center)
    b = R + stl.elevation / 1000  # do cao ve tinh tu tam Trai Dat
    a = R * math.cos((math.pi / 2) + alpha) + math.sqrt(
        b ** 2 - (R ** 2) * (math.sin((math.pi / 2) + alpha)) ** 2)
    radius = (math.acos((R ** 2 + b ** 2 - a ** 2) / (2 * R * b))) * R

    #  tính khoảng cách từ subpoint_stl đến vị trí các đỉnh
    sublat = math.degrees(stl.sublat)
    sublong = math.degrees(stl.sublong)
    lat_radian = sublat * const
    long_radian = sublong * const
    distance = []
    for n in [[obs1_lat, obs1_long], [obs2_lat, obs2_long], [obs3_lat, obs3_long], [obs4_lat, obs4_long]]:
        dlat = float(n[0]) * const - lat_radian
        dlong = float(n[1]) * const - long_radian
        a1 = math.sin(dlat / 2) ** 2 + math.cos(lat_radian) * math.cos(
            float(n[0]) * const) * math.sin(dlong / 2) ** 2
        a2 = 2 * math.asin(math.sqrt(a1))
        distance_km = 6371 * a2
        distance.append(distance_km)

    #  kiểm tra điều kiện đi qua các đỉnh của vùng và tính toán
    if max(distance) <= radius:
        print(line[i - 2], end='')  # name sate
        print(i)
        print('Maximum elevation:' + str(altt))
        print("""Date/Time (UTC+7)   Elev / Azim    Lat / Long	 Alt     Dis    Radius""")
        print("""=====================================================================""")

        #  chia khoảng thời gian
        list_detail = [t1, t2, tr, tt, ts]
        delta_t = (ts - tr) / 10
        for j in range(2, 9):
            t_detail = tr + j * delta_t
            list_detail.append(t_detail)

        sorted_list = sorted(list_detail)
        print(sorted_list)
        for x in sorted_list:
            obs_center.date = x  # thời gian tại vị trí quan sát
            stl.compute(obs_center)  # tính toán ở vị trí quan sát tại thời gian trên
            trvn = ephem.Date(x + 7 * ephem.hour)

            sublat = math.degrees(stl.sublat)
            sublong = math.degrees(stl.sublong)
            locator = Nominatim(user_agent='myGeocoder')
            coordinates = '%s, %s' % (str(sublat), str(sublong))
            location = locator.reverse(coordinates)

            # tinh ban kinh vung phu hieu qua cua ve tinh
            h = R + stl.elevation / 1000  # do cao ve tinh tu tam Trai Dat
            a = R * math.cos((math.pi / 2) + alpha) + math.sqrt(
                h ** 2 - (R ** 2) * (math.sin((math.pi / 2) + alpha)) ** 2)
            radius = (math.acos((R ** 2 + h ** 2 - a ** 2) / (2 * R * h))) * R

            r = "%s | %4.1f  %5.1f | %4.1f %+6.1f | %5.1f | %5.1f  %.2f " % (
                trvn, math.degrees(stl.alt), math.degrees(stl.az), sublat,
                sublong, stl.elevation / 1000, stl.range / 1000, radius)
            try:
                print(r + '%s' % (
                    GoogleTranslator(source='auto', target='vi').translate(location.address)))
            except (AttributeError, ConnectionError):
                print(r)
        k = k + 1
        print()


# tinh toan, du doan
k = 0
id = 43231  # nhap id
for i in range(2, len(line), 3):
    id_str = line[i][2:7]
    id_int = int(id_str)
    if id_int == id:
        print(id_int)
        stl = ephem.readtle(line[i - 2], line[i - 1], line[i])
        obs_center.date = datetime.datetime.utcnow()  # chinh gio ve hien tai ve gio utc
        try:
            while obs_center.date < t2:  # số lần đi qua
                tr, azr, tt, altt, ts, azs = obs_center.next_pass(stl)
                print(tr, azr, tt, altt, ts, azs)
                if ts == obs_center.date:
                    break
                if tr <= t2 and ts >= t1 and altt > alpha:
                    if t1 <= tt <= t2:
                        print('t1<tt<t2')
                        orbit_stl(tr, tt, ts)
                    elif tt < t1:
                        #  chia khoảng thời gian
                        delta_t = (ts - tr) / 10
                        t_detail = t1
                        m = 0
                        while t_detail <= ts:
                            obs_center.date = t_detail
                            stl.compute(obs_center)
                            if stl.alt >= alpha:
                                print('tt<t1')
                                orbit_stl(tr, tt, ts)
                                break
                            else:
                                m += 1
                                t_detail = t1 + m * delta_t
                                continue
                    elif tt > t2:
                        #  chia khoảng thời gian
                        delta_t = (ts - tr) / 10
                        t_detail = tr
                        m = 0
                        while t_detail <= t2:
                            obs_center.date = t_detail
                            stl.compute(obs_center)
                            if stl.alt >= alpha:
                                print('tt>t2')
                                orbit_stl(tr, tt, ts)
                                break
                            else:
                                m += 1
                                t_detail = tr + m * delta_t
                                continue
                obs_center.date = ts
        except (ValueError, TypeError, KeyError):
            pass
print('Number of pass:', k)
