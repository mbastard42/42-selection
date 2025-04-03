/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ray_casting.c                                      :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/09 03:18:27 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 03:36:05 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

static t_vec	init_screen(t_data *d)
{
	t_vec	screen;

	screen = new_vec(dup_pt(d->ply.e), dup_pt(d->ply.s));
	rotate_vec(&screen, screen.s, M_PI_2);
	slide_along_vec(&screen, -screen.rad / 2);
	stretch_vec(&screen, -screen.rad);
	return (screen);
}

static void	display_line(t_data *d, int col, t_vec line, t_img *tex)
{
	int		i;
	double	x;
	double	y;
	char	*addr;

	i = -1;
	col %= d->ms;
	col *= tex->xs / d->ms;
	while (++i < line.rad)
	{
		x = i * cos(line.theta) + line.s.x;
		y = i * sin(line.theta) + line.s.y;
		addr = mlx_get_data_addr(tex->ptr, &tex->bpp, &tex->llen, &tex->ndn);
		addr += (int)(col * tex->llen) + (int)(i * tex->ys / line.rad) \
		* tex->bpp / 8;
		pixel_to_img(&d->mlx.dsp, (int)x, (int)y, *(int *)addr);
	}
}

static void	render_line(t_data *d, t_vec wall, t_vec ray, t_vec line)
{
	t_vec	tmp;

	tmp = new_vec(dup_pt(wall.s), dup_pt(ray.e));
	if (wall.s.x != wall.e.x)
	{
		if (d->ply.s.y < wall.s.y)
			display_line(d, (int)tmp.rad, line, &d->wall[0]);
		else
			display_line(d, (int)tmp.rad, line, &d->wall[1]);
	}
	if (wall.s.y != wall.e.y)
	{
		if (d->ply.s.x < wall.s.x)
			display_line(d, (int)tmp.rad, line, &d->wall[2]);
		else
			display_line(d, (int)tmp.rad, line, &d->wall[3]);
	}
}

void	ray_casting(t_data *d)
{
	size_t	i;
	t_vec	ray;
	t_vec	screen;

	i = -1;
	clean_img(&d->mlx.dsp);
	fill_img(&d->mlx.dsp, 0, d->mlx.ys / 2, d->floor);
	fill_img(&d->mlx.dsp, d->mlx.ys / 2, d->mlx.ys, d->ceil);
	screen = init_screen(d);
	while (++i < d->mlx.xs)
	{
		ray = new_vec(d->ply.s, screen.e);
		render_line(d, collide(d, &ray, &d->map), ray, line(d, ray, i));
		stretch_vec(&screen, d->ply.rad / d->mlx.xs);
	}
	mlx_put_image_to_window(d->mlx.ptr, d->mlx.mntr, d->mlx.dsp.ptr, 0, 0);
}
