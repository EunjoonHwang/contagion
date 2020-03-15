import csv
import json
import collections
import math


def accumulate_by_country(csv_filename):
    data_dict = {}
    with open(csv_filename, newline='') as csvfile:
        csv_reader = csv.DictReader(csvfile)
        for row in csv_reader:
            # print(len(row))
            # print(sorted(row.keys()))
            for key in sorted(row.keys()):
                country = row["Country/Region"]
                if key  not in ['Country/Region', 'Lat', 'Long', 'Province/State']:
                    # print(country, key, row[key])
                    new_key = country + "@" + key
                    value = row[key]
                    # print(value, type(value))
                    if new_key in data_dict:
                        if value.isdigit():
                            data_dict[new_key] += float(value)
                        else:
                            data_dict[new_key] += 0
                    else:
                        if value.isdigit():
                            data_dict[new_key] = float(value)
                        else:
                            data_dict[new_key] = 0
                            
    return collections.OrderedDict(sorted(data_dict.items()))


def generate_data(data_dict):
    final_data = []
    for k, v in data_dict.items():
        keys = k.split("@")
        # print(keys[0], keys[1], v)
        tokens = keys[1].split("/")
        date = "20" + tokens[2] + "-0" + tokens[0] + "-" + tokens[1] + "T00:00:00.000Z"
        if v > 0:
            item = {"name" : keys[0], "date" : date, "value" : math.log(v, 10), "category" : "test"}
        else:
            item = {"name" : keys[0], "date" : date, "value" : v, "category" : "test"}
        final_data.append(item)
    return final_data


def main():
    print("start accumulate_by_country()")
    data_dict = accumulate_by_country('corona_confirmed.csv')
    print("start generate_data(data_dict)")
    final_data = generate_data(data_dict)
    # print(len(final_data))
    # for data in final_data:
    #     print(data.items())
    print("save data")
    with open('../src/covid_data.json', 'w') as fp:
        json.dump(final_data, fp, sort_keys=True, indent=4, separators=(',', ': '))


if __name__ == "__main__":
    main()
