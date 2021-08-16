import math
import ephem
import datetime

#  open file .txt and read data
f = open('data.txt', 'r')
line = f.readlines()

#  nhap tọa độ vị trí quan sát
obs_center = ephem.Observer()
#  tọa độ trung tâm chỉ huy
obs_center.lat = '21.15557752317632'
obs_center.long = '105.95090331286549'
#  4 tọa độ ở 4 đỉnh của vùng bảo vệ
obs1_lat = '21.24269731684942'
obs1_long = '105.82729935379976'
obs2_lat = '21.222203165528786'
obs2_long = '106.08146083576183'
obs3_lat = '21.118407881557022'
obs3_long = '105.76822398231668'
obs4_lat = '21.083793289035345'
obs4_long = '106.10619006103384'

#  nhập thời gian
time1_input = input('Enter a datetime1 in YYYY-MM-DD HH:MM:SS format: ')  # interested local time
time2_input = input('Enter a datetime2 in YYYY-MM-DD HH:MM:SS format: ')
time1 = datetime.datetime.strptime(time1_input, '%Y-%m-%d %H:%M:%S')
time2 = datetime.datetime.strptime(time2_input, '%Y-%m-%d %H:%M:%S')
timeutc1 = ephem.Date(time1)  # convert interested local time to ephem.Date
timeutc2 = ephem.Date(time2)
t1 = ephem.Date(timeutc1-7*ephem.hour)  # convert interested local time to utc time in ephem.Date
t2 = ephem.Date(timeutc2-7*ephem.hour)

#  nhập các hằng số
alpha = ephem.degrees('45:00:00')  # minimum elevation
R = 6371  # ban kinh Trai Dat
const = 0.01746031


def orbit_stl(tr, tt, ts):  # hàm tính quỹ đạo vệ tinh
    # tính bán kính vùng phủ tại thời điểm tt
    global id, k
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
        print(line[id - 2], end='')  # name sate
        id_str = line[id][2:7]  # lay ra id dang chuoi
        id_int = int(id_str)  # doi id sang dang integer
        print(id_int)
        # print('Maximum elevation:' + str(altt))
        # print("""Date/Time (UTC+7)   Elev / Azim    Lat / Long	 Alt     Dis    Radius""")
        # print("""=====================================================================""")

        sorted_list = sorted([tr, tt, ts, t1, t2])
        for x in sorted_list:
            obs_center.date = x  # thời gian tại vị trí quan sát
            stl.compute(obs_center)  # tính toán ở vị trí quan sát tại thời gian trên
            trvn = ephem.Date(x + 7 * ephem.hour)

            sublat = math.degrees(stl.sublat)
            sublong = math.degrees(stl.sublong)

            # tinh ban kinh vung phu hieu qua cua ve tinh
            h = R + stl.elevation / 1000  # do cao ve tinh tu tam Trai Dat
            a = R * math.cos((math.pi / 2) + alpha) + math.sqrt(
                h ** 2 - (R ** 2) * (math.sin((math.pi / 2) + alpha)) ** 2)
            radius = (math.acos((R ** 2 + h ** 2 - a ** 2) / (2 * R * h))) * R

            r = "%s | %4.1f  %5.1f | %4.1f %+6.1f | %5.1f | %5.1f  %.2f " % (
                trvn, math.degrees(stl.alt), math.degrees(stl.az), sublat,
                sublong, stl.elevation / 1000, stl.range / 1000, radius)
            # print(r)
        k = k + 1
        # print()


# tính toán, dự đoán, in kết quả
k = 0
for id in range(2, len(line), 3):
    stl = ephem.readtle(line[id - 2], line[id - 1], line[id])
    obs_center.date = datetime.datetime.utcnow()  # chinh gio ve hien tai ve gio utc
    try:
        while obs_center.date < t2:  # số lần đi qua
            tr, azr, tt, altt, ts, azs = obs_center.next_pass(stl)
            if ts == obs_center.date:
                break
            if tr <= t2 and ts >= t1 and altt > alpha:   # điều kiện thời gian và góc ngẩng phù hợp
                if t1 < tt < t2:
                    orbit_stl(tr, tt, ts)
                elif tt < t1:
                    #  chia nhỏ khoảng thời gian khảo sát
                    delta_t = (ts - tr) / 10
                    t_detail = t1
                    m = 0
                    while t_detail <= ts:
                        obs_center.date = t_detail
                        stl.compute(obs_center)
                        if stl.alt >= alpha:
                            orbit_stl(tr, tt, ts)
                            break
                        else:
                            m += 1
                            t_detail = t1 + m * delta_t
                            continue
                elif tt > t2:
                    #  chia nhỏ khoảng thời gian khảo sát
                    delta_t = (ts - tr) / 10
                    t_detail = tr
                    m = 0
                    while t_detail <= t2:
                        obs_center.date = t_detail
                        stl.compute(obs_center)
                        if stl.alt >= alpha:
                            orbit_stl(tr, tt, ts)
                            break
                        else:
                            m += 1
                            t_detail = tr + m * delta_t
                            continue
            obs_center.date = ts
    except (ValueError, TypeError, KeyError):
        continue
print('Number of satellite_pass:', k)
