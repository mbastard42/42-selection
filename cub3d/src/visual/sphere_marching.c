/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sphere_marching.c                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/02 22:07:24 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 02:35:54 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

static t_vec	sonar(t_pt P, t_wall **map)
{
	double	old_rad;
	double	radius;
	t_wall	*view;
	t_vec	vec;

	view = *map;
	vec = dup_vec(view->vec);
	old_rad = pt_to_vec_dst(P, view->vec);
	while (view)
	{
		radius = pt_to_vec_dst(P, view->vec);
		if (radius < old_rad)
		{
			vec = dup_vec(view->vec);
			old_rad = radius;
		}
		view = view->next;
	}
	return (vec);
}

t_vec	collide(t_data *d, t_vec *ray, t_wall **map)
{
	double	radius;

	if (!map || !*map)
		return (new_vec(new_pt(0, 0), new_pt(0, 0)));
	radius = pt_to_vec_dst(ray->s, sonar(ray->s, map));
	stretch_vec(ray, radius - ray->rad);
	while (radius > 0.1 && ray->rad < d->mx * d->my * d->ms)
	{
		radius = pt_to_vec_dst(ray->e, sonar(ray->e, map));
		stretch_vec(ray, radius);
	}
	if (ray->rad > d->ms * d->mx * d->my)
		return (new_vec(new_pt(0, 0), new_pt(0, 0)));
	return (sonar(ray->e, map));
}

t_vec	line(t_data *d, t_vec ray, int col)
{
	t_pt	s;
	t_pt	e;
	int		height;

	if (!ray.rad)
		return (new_vec(new_pt(col, d->mlx.ys / 2), \
		new_pt(col, d->mlx.ys / 2)));
	ray.rad *= cos(ray.theta - d->ply.theta);
	height = d->mx * d->my * d->ms / ray.rad;
	if (height > (int)d->mlx.ys)
		height = d->mlx.ys;
	s = new_pt(col, d->mlx.ys / 2 - height / 2);
	e = new_pt(col, s.y + height);
	return (new_vec(s, e));
}
