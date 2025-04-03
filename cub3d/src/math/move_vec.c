/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   move_vec.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/04 23:04:36 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/21 05:53:46 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

void	slide_vec(t_vec *vec, double x, double y)
{
	vec->s.x += x;
	vec->s.y += y;
	vec->e.x += x;
	vec->e.y += y;
}

void	slide_along_vec(t_vec *vec, double step)
{
	vec->s.x += step * cos(vec->theta);
	vec->s.y += step * sin(vec->theta);
	vec->e.x += step * cos(vec->theta);
	vec->e.y += step * sin(vec->theta);
}

void	stretch_vec(t_vec *vec, double step)
{
	vec->e.x += step * cos(vec->theta);
	vec->e.y += step * sin(vec->theta);
	vec->rad = hypot(vec->e.x - vec->s.x, vec->e.y - vec->s.y);
}

void	rotate_vec(t_vec *vec, t_pt center, double theta)
{
	slide_vec(vec, -center.x, -center.y);
	vec->theta += theta;
	if (vec->theta >= 2 * M_PI)
		vec->theta = vec->theta - 2 * M_PI;
	if (vec->theta < 0)
		vec->theta = vec->theta + 2 * M_PI;
	vec->e.x = vec->rad * cos(vec->theta);
	vec->e.y = vec->rad * sin(vec->theta);
	slide_vec(vec, center.x, center.y);
}
