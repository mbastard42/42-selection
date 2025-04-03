/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   check_map.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/24 02:04:00 by hvincent          #+#    #+#             */
/*   Updated: 2022/11/25 04:29:17 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

static int	unsurrounded(t_data *d, int i, int j)
{
	if (i == 6 || (i && !ft_strchr("01SWEN", d->f[i - 1][j])))
		return (1);
	if (!d->f[i + 1] || !ft_strchr("01SWEN", d->f[i + 1][j]))
		return (1);
	if (!j || !ft_strchr("01SWEN", d->f[i][j - 1]))
		return (1);
	if (!d->f[i][j + 1] || !ft_strchr("01SWEN", d->f[i][j + 1]))
		return (1);
	return (0);
}

void	check_map(t_data *d)
{
	int	i;
	int	j;
	int	p;

	p = 0;
	i = 5;
	while (d->f[++i])
	{
		j = -1;
		while (d->f[i][++j])
		{
			if (ft_strchr("SWEN", d->f[i][j]))
				p++;
			if (!ft_strchr("01SWEN ", d->f[i][j]))
				quit(d, "invalid map", 1);
			if (d->f[i][j] == '0' && unsurrounded(d, i, j))
				quit(d, "unsurrounded map", 1);
		}
	}
	if (p > 1)
		quit(d, "too many players", 1);
}
