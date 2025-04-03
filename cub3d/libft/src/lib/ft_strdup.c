/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strdup.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/11/03 15:29:40 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/23 06:20:57 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/libft.h"

char	*ft_strdup(const char *s1)
{
	char			*s2;

	s2 = (char *)ft_calloc(ft_strlen(s1, 0) + 1, sizeof(char));
	if (!s2)
		return (NULL);
	ft_strlcpy(s2, s1, ft_strlen(s1, 0) + 1);
	return (s2);
}
