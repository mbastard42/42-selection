/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   color.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/11 21:54:36 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 03:07:01 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

uint8_t	extract_trgb(int trgb, uint8_t component)
{
	if (component == 't')
		return (((uint8_t *)&trgb)[3]);
	if (component == 'r')
		return (((uint8_t *)&trgb)[2]);
	if (component == 'g')
		return (((uint8_t *)&trgb)[1]);
	if (component == 'b')
		return (((uint8_t *)&trgb)[0]);
	return (0);
}

int	assemble_trgb(uint8_t t, uint8_t r, uint8_t g, uint8_t b)
{
	uint8_t	trgb[4];

	trgb[3] = t;
	trgb[2] = r;
	trgb[1] = g;
	trgb[0] = b;
	return (*(int *)trgb);
}
