/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ft_strjoin.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2021/11/25 17:15:47 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/23 07:37:27 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/libft.h"

char	*ft_strjoin(char *s1, char *s2, int clean1, int clean2)
{
	char	*dst;

	if (s1 == NULL && s2 == NULL)
		return (NULL);
	if (s1 == NULL)
		return (s2);
	if (s2 == NULL)
		return (s1);
	dst = ft_calloc(ft_strlen(s1, 0) + ft_strlen(s2, 0) + 1, sizeof(char));
	if (dst == NULL)
		return (NULL);
	ft_strlcpy(dst, s1, ft_strlen(s1, 0) + 1);
	ft_strlcat(dst, s2, ft_strlen(s1, 0) + ft_strlen(s2, 0) + 1);
	if (clean1 && s1)
		free(s1);
	if (clean2 && s2)
		free(s2);
	return (dst);
}
