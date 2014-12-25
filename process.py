
if __name__ == "__main__":
	with open('raw.txt', 'r') as f:
		dimension = ''
		reorder_dict = dict()
		column = f.readline().strip().split()
		dimension_list = list()
		for line in f:
			entries = line.strip().split()
			if len(entries) == 1:
				dimension = entries[0].strip()
				dimension_list.append(dimension)
			else:
				for i in range(1,len(entries)):
					if column[i-1] == '區域別總計' or column[i-1]=='消防署' or column[i-1] == '基隆港' or column[i-1] == '臺中港' or column[i-1] == '高雄港' or column[i-1] == '花蓮港' :
						continue
					if (entries[0]+column[i-1]) not in reorder_dict:
						reorder_dict[(entries[0]+column[i-1])] = {dimension : entries[i]}
					else:
						reorder_dict[(entries[0]+column[i-1])][dimension] = entries[i]
		f.close()
		with open('output.csv', 'w') as w:
			w.write('時間地點,')
			for d in dimension_list:
				w.write(d + ',')
			w.write('消防車/土地面積(平方公里),消防車/人口數(人),救災車/土地面積(平方公里),救災車/人口數(人),消防勤務車/土地面積(平方公里),消防勤務車/人口數(人),救護車輛/土地面積(平方公里),救護車輛/人口數(人),消防人力總計/土地面積(平方公里),消防人力總計/人口數(人)')
			w.write('\n')

			for k in reorder_dict:
				w.write(k + ',')
				for d in dimension_list:
					if d in reorder_dict[k]:
						w.write(reorder_dict[k][d] + ',')
					else :
						w.write( '0,')
				w.write(str(float(reorder_dict[k]['消防車'])/float(reorder_dict[k]['土地面積(平方公里)']))+',')
				w.write(str(float(reorder_dict[k]['消防車'])/float(reorder_dict[k]['人口數(人)']))+',')
				w.write(str(float(reorder_dict[k]['救災車'])/float(reorder_dict[k]['土地面積(平方公里)']))+',')
				w.write(str(float(reorder_dict[k]['救災車'])/float(reorder_dict[k]['人口數(人)']))+',')
				w.write(str(float(reorder_dict[k]['消防勤務車'])/float(reorder_dict[k]['土地面積(平方公里)']))+',')
				w.write(str(float(reorder_dict[k]['消防勤務車'])/float(reorder_dict[k]['人口數(人)']))+',')
				w.write(str(float(reorder_dict[k]['救護車輛'])/float(reorder_dict[k]['土地面積(平方公里)']))+',')
				w.write(str(float(reorder_dict[k]['救護車輛'])/float(reorder_dict[k]['人口數(人)']))+',')
				w.write(str(float(reorder_dict[k]['消防人力總計'])/float(reorder_dict[k]['土地面積(平方公里)']))+',')
				w.write(str(float(reorder_dict[k]['消防人力總計'])/float(reorder_dict[k]['人口數(人)']))+',')
				w.write('\n')
		w.close()



