/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init_param_bis.c                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/25 02:46:56 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 03:12:10 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

void	init_wall_end(t_data *d, char **tmp, int id)
{
	if (ft_strlen(tmp[1], 0) < 4 || \
	!ft_strnstr(&tmp[1][ft_strlen(tmp[1], 0) - 4], ".xpm", 4))
	{
		ft_free_tab(tmp);
		quit(d, "wrong texture format", 1);
	}
	d->wall[id].ptr = mlx_xpm_file_to_image(d->mlx.ptr, tmp[1], \
		&d->wall[id].xs, &d->wall[id].ys);
	if (!d->wall[id].ptr)
	{
		ft_free_tab(tmp);
		quit(d, "can't open texture", 1);
	}
}

u_int8_t	ft_atoui(const char *str)
{
	u_int8_t	result;

	result = 0;
	while ((*str >= 9 && *str <= 13) || *str == 32)
	str++;
	if (ft_isdigit(*str))
		result = result * 10 + (*str - 48);
	while (ft_isdigit(*++str))
		result = result * 10 + (*str - 48);
	return (result);
}
