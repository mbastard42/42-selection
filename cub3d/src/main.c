/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/08/08 02:10:59 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 03:27:54 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/cub3d.h"

static int	simple_quit(t_data *data)
{
	quit(data, NULL, 0);
	return (0);
}

static int	get_keycode(int keycode, t_data *d)
{
	if (keycode == 53)
		quit(d, NULL, 0);
	if (keycode == 13)
		slide_vec(&d->ply, 3, 0);
	if (keycode == 1)
		slide_vec(&d->ply, -3, 0);
	if (keycode == 0)
		slide_vec(&d->ply, 0, 3);
	if (keycode == 2)
		slide_vec(&d->ply, 0, -3);
	if (keycode == 126)
		slide_along_vec(&d->ply, 9);
	if (keycode == 125)
		slide_along_vec(&d->ply, -9);
	if (keycode == 124)
		rotate_vec(&d->ply, d->ply.s, rad(-4.5));
	if (keycode == 123)
		rotate_vec(&d->ply, d->ply.s, rad(4.5));
	ray_casting(d);
	return (0);
}

int	main(int argc, char **argv)
{
	t_data	data;

	init_cub3d(&data, argc, argv);
	ray_casting(&data);
	mlx_hook(data.mlx.mntr, 2, 0, &get_keycode, &data);
	mlx_hook(data.mlx.mntr, 17, 0, &simple_quit, &data);
	mlx_loop(data.mlx.ptr);
	return (0);
}
