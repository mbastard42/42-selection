/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init_param.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/11/22 01:12:19 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 04:30:21 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

void	init_wall_end(t_data *d, char **tmp, int id);

static int	ft_str_is_digit(char *str)
{
	int	i;

	i = 0;
	while (str[i])
	{
		if (!ft_isdigit(str[i]))
			return (0);
		i++;
	}
	return (1);
}

static void	init_color(t_data *d, char **rgb, int id)
{
	if (id == 4)
		d->floor = assemble_trgb(0, ft_atoui(rgb[0]), \
		ft_atoui(rgb[1]), ft_atoui(rgb[2]));
	if (id == 5)
		d->ceil = assemble_trgb(0, ft_atoui(rgb[0]), \
		ft_atoui(rgb[1]), ft_atoui(rgb[2]));
	ft_free_tab(rgb);
}

static void	handle_color(t_data *d, char *str, int id)
{
	int		i;
	char	**tmp;

	i = 0;
	tmp = ft_split(str, ',');
	while (tmp[i])
		i++;
	if (i != 3)
		quit(d, "invalid rgb format", 1);
	i = 0;
	while (tmp[++i])
	{
		if (!ft_str_is_digit(tmp[i]) || \
			!(0 <= ft_atoi(tmp[i]) && ft_atoi(tmp[i]) <= 255))
		{
			ft_free_tab(tmp);
			quit(d, "invalid rgb value", 1);
		}
	}
	init_color(d, tmp, id);
}

static void	init_wall_tex(t_data *d, char *line, int id)
{
	char		**tmp;
	static int	done[6] = {0, 0, 0, 0, 0, 0};

	if (done[id])
		quit(d, "same texture twice", 1);
	done[id] = 1;
	tmp = ft_split(line, ' ');
	if (id == 4 || id == 5)
		handle_color(d, tmp[1], id);
	else
		init_wall_end(d, tmp, id);
	ft_free_tab(tmp);
}

void	init_param(t_data *d)
{
	int	i;

	i = 0;
	while (d->f[i] && i < 6)
	{
		if (!ft_strncmp(d->f[i], "NO ", 3))
			init_wall_tex(d, d->f[i], 0);
		else if (!ft_strncmp(d->f[i], "SO ", 3))
			init_wall_tex(d, d->f[i], 1);
		else if (!ft_strncmp(d->f[i], "WE ", 3))
			init_wall_tex(d, d->f[i], 2);
		else if (!ft_strncmp(d->f[i], "EA ", 3))
			init_wall_tex(d, d->f[i], 3);
		else if (!ft_strncmp(d->f[i], "F ", 2))
			init_wall_tex(d, d->f[i], 4);
		else if (!ft_strncmp(d->f[i], "C ", 2))
			init_wall_tex(d, d->f[i], 5);
		else
			quit(d, "wrong params", 1);
		i++;
	}
	if (i < 5)
		quit(d, "not enough params", 1);
}
