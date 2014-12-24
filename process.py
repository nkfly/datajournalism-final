
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
					if (column[i-1] == '區域別總計'):
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
			w.write('\n')

			for k in reorder_dict:
				w.write(k + ',')
				for d in dimension_list:
					if d in reorder_dict[k]:
						w.write(reorder_dict[k][d] + ',')
					else :
						w.write( '0,')
				w.write('\n')
		w.close()



