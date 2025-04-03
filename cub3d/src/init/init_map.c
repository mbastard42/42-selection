/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init_map.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/11 21:52:11 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 03:35:23 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

static t_wall	*new_wall(t_vec vec)
{
	t_wall	*wall;

	wall = malloc(sizeof(t_wall));
	wall->vec = dup_vec(vec);
	wall->next = NULL;
	return (wall);
}

static void	add_wall_vec(t_wall **map, t_vec vec)
{
	int		out;
	t_wall	*view;

	out = 0;
	view = *map;
	if (map && *map)
	{
		if (!pt_dst(view->vec.e, vec.s)
			&& !((int)fabs(view->vec.theta - vec.theta) % 180) && !out++)
			view->vec = new_vec(view->vec.s, vec.e);
		while (view->next && !out)
		{
			if (!pt_dst(view->next->vec.e, vec.s) && \
				!((int)fabs(view->next->vec.theta - vec.theta) % 180) && \
				!out++)
				view->next->vec = new_vec(view->next->vec.s, vec.e);
			if (!out)
				view = view->next;
		}
		if (!out)
			view->next = new_wall(vec);
	}
	else if (map)
		*map = new_wall(vec);
}

static void	add_wall_xy(t_wall **map, size_t x, size_t y, char place)
{
	size_t	s;
	t_vec	vec;

	s = 30;
	if (place == 'u')
		vec = new_vec(new_pt(x * s, y * s), new_pt(x * s + s, y * s));
	if (place == 'r')
		vec = new_vec(new_pt(x * s + s, y * s), new_pt(x * s + s, y * s + s));
	if (place == 'd')
		vec = new_vec(new_pt(x * s, y * s + s), new_pt(x * s + s, y * s + s));
	if (place == 'l')
		vec = new_vec(new_pt(x * s, y * s), new_pt(x * s, y * s + s));
	add_wall_vec(map, vec);
}

void	init_map(t_data *d, size_t x, size_t y)
{
	d->map = NULL;
	while (d->f[++y])
	{
		x = -1;
		while (d->f[y][++x])
		{
			if (d->f[y][x] == 49 && y > 6 && ft_strchr("SWEN0", d->f[y - 1][x]))
				add_wall_xy(&d->map, x, y, 'u');
			if (d->f[y][x] == '1' && d->f[y][x + 1] && \
			ft_strchr("SWEN0", d->f[y][x + 1]))
				add_wall_xy(&d->map, x, y, 'r');
			if (d->f[y][x] == '1' && d->f[y + 1] && d->f[y + 1][x]
				&& ft_strchr("SWEN0", d->f[y + 1][x]))
				add_wall_xy(&d->map, x, y, 'd');
			if (d->f[y][x] == '1' && x && ft_strchr("SWEN0", d->f[y][x - 1]))
				add_wall_xy(&d->map, x, y, 'l');
		}
		if (x > d->mx)
			d->mx = x;
	}
	d->ms = 30;
	d->my = y;
}
