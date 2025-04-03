/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   distance.c                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/04 23:06:21 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/23 03:30:03 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

double	pt_dst(t_pt A, t_pt B)
{
	return (hypot(B.x - A.x, B.y - A.y));
}

double	pt_to_vec_dst(t_pt P, t_vec vec)
{
	t_pt	a;
	t_pt	b;
	t_pt	cp;
	t_pt	tmp;
	double	param;

	param = -1;
	a.x = P.x - vec.s.x;
	a.y = P.y - vec.s.y;
	b.x = vec.e.x - vec.s.x;
	b.y = vec.e.y - vec.s.y;
	if (b.x * b.x + b.y * b.y != 0)
		param = (a.x * b.x + a.y * b.y) / (b.x * b.x + b.y * b.y);
	if (param <= 0)
		tmp = dup_pt(vec.s);
	else if (param >= 1)
		tmp = dup_pt(vec.e);
	else
		tmp = new_pt(vec.s.x + param * b.x, vec.s.y + param * b.y);
	cp = new_pt(P.x - tmp.x, P.y - tmp.y);
	return (hypot(cp.x, cp.y));
}

int	pt_in_trgl(t_pt P, t_pt A, t_pt B, t_pt C)
{
	double	w1;
	double	w2;
	double	top;
	double	bottom;

	top = A.x * (C.y - A.y) + (P.y - A.y) * (C.x - A.x) - P.x * (C.y - A.y);
	bottom = (B.y - A.y) * (C.x - A.x) - (B.x - A.x) * (C.y - A.y);
	w1 = top / bottom;
	top = P.y - A.y - w1 * (B.y - A.y);
	bottom = C.y - A.y;
	w2 = top / bottom;
	if (w1 >= 0 && w2 >= 0)
		return (1);
	return (0);
}
