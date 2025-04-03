/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   quit.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/22 00:58:28 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 04:22:24 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/cub3d.h"

void	clean_tex(t_data *d)
{
	int	i;

	i = -1;
	while (++i < 4)
		if (d->wall[i].ptr)
			mlx_destroy_image(d->mlx.ptr, d->wall[i].ptr);
}

void	quit(t_data *d, char *error_message, int clean)
{
	if (clean > 0)
		clean_tex(d);
	if (clean > 1)
		free_mlx(&d->mlx);
	if (error_message)
	{
		ft_putendl_fd("Error", 1);
		ft_putendl_fd(error_message, 1);
	}
	exit(0);
}
